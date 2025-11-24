import { createClient } from "@supabase/supabase-js"
import fs from "fs"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const credentials = []

async function generateUsers() {
  try {
    const { data: hospitales, error: hospitalError } = await supabase
      .from("hospitales")
      .select("id, estado, tipo, numero_clinica, localidad")

    if (hospitalError) throw hospitalError

    console.log(`Encontrados ${hospitales.length} hospitales`)

    // For each hospital, create: 1 auxiliar, 1 bodega, 1 lider
    for (const hospital of hospitales) {
      const roles = ["auxiliar", "bodega", "lider"]
      const hospitalName = `${hospital.tipo}${hospital.numero_clinica}`

      for (const role of roles) {
        const email = `${role}.${hospitalName.toLowerCase()}@hospital.com`
        const password = "Password123!"
        const fullName = `${role.charAt(0).toUpperCase() + role.slice(1)} ${hospitalName}`

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
          },
        })

        if (authError) {
          console.error(`Error creando usuario ${email}:`, authError.message)
          continue
        }

        // Insert into profiles table
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role,
        })

        if (profileError) {
          console.error(`Error creando perfil para ${email}:`, profileError.message)
          continue
        }

        // Insert into users table with hospital assignment
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email,
          nombre: fullName,
          rol: role,
          hospital_id: hospital.id,
        })

        if (userError) {
          console.error(`Error asignando hospital para ${email}:`, userError.message)
          continue
        }

        credentials.push({ email, password, role, hospital: hospitalName, estado: hospital.estado })
        console.log(`✓ Creado: ${email}`)
      }
    }

    // Create supervisors (max 4 hospitals per state)
    const estados = [...new Set(hospitales.map((h) => h.estado))]

    for (const estado of estados) {
      const hospitalesEnEstado = hospitales.filter((h) => h.estado === estado)
      const numSupervisores = Math.ceil(hospitalesEnEstado.length / 4)

      for (let i = 0; i < numSupervisores; i++) {
        const email = `supervisor.${estado.toLowerCase().replace(/\s+/g, "_")}_${i + 1}@hospital.com`
        const password = "Password123!"
        const fullName = `Supervisor ${estado} ${i + 1}`

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
          },
        })

        if (authError) {
          console.error(`Error creando supervisor ${email}:`, authError.message)
          continue
        }

        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role: "supervisor",
        })

        if (profileError) {
          console.error(`Error creando perfil supervisor ${email}:`, profileError.message)
          continue
        }

        // Assign hospitals to supervisor
        const hospitalesAsignados = hospitalesEnEstado.slice(i * 4, (i + 1) * 4)

        for (const hospital of hospitalesAsignados) {
          await supabase.from("user_roles").insert({
            user_id: authData.user.id,
            hospital_id: hospital.id,
            rol: "supervisor",
          })
        }

        credentials.push({
          email,
          password,
          role: "supervisor",
          estado,
          hospitales: hospitalesAsignados.map((h) => `${h.tipo}${h.numero_clinica}`),
        })
        console.log(`✓ Creado supervisor: ${email}`)
      }
    }

    // Create 1 gerente with access to all hospitals
    const email = "gerente.operaciones@hospital.com"
    const password = "Password123!"
    const fullName = "Gerente de Operaciones"

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    })

    if (!authError) {
      await supabase.from("profiles").insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: "gerente",
      })

      // Assign all hospitals
      for (const hospital of hospitales) {
        await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          hospital_id: hospital.id,
          rol: "gerente",
        })
      }

      credentials.push({ email, password, role: "gerente", access: "all_hospitals" })
      console.log(`✓ Creado gerente: ${email}`)
    }

    // Save credentials to JSON
    fs.writeFileSync("credentials.json", JSON.stringify(credentials, null, 2))
    console.log("\n✅ Proceso completado!")
    console.log(`Total usuarios creados: ${credentials.length}`)
    console.log("Credenciales guardadas en: credentials.json")
  } catch (error) {
    console.error("Error general:", error)
  }
}

generateUsers()
