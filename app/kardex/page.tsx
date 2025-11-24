import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Profile } from "@/lib/types"

export default async function KardexPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single<Profile>()

  if (!profile) {
    redirect("/auth/login")
  }

  const { data: kardexData } = await supabase
    .from("kardex")
    .select(`
      *,
      insumos (nombre, codigo),
      profiles (full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  const getMovementBadge = (tipo: string) => {
    switch (tipo) {
      case "entrada":
        return <Badge className="bg-green-600">Entrada</Badge>
      case "salida":
        return <Badge className="bg-red-600">Salida</Badge>
      case "ajuste":
        return <Badge className="bg-blue-600">Ajuste</Badge>
      case "transferencia":
        return <Badge className="bg-purple-600">Transferencia</Badge>
      default:
        return <Badge>{tipo}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar profile={profile} />

      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kardex</h1>
          <p className="mt-2 text-gray-600">Historial de movimientos de inventario</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Movimientos de Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-gray-600">
                    <th className="pb-3">Fecha</th>
                    <th className="pb-3">Insumo</th>
                    <th className="pb-3">Tipo</th>
                    <th className="pb-3">Cantidad</th>
                    <th className="pb-3">Stock Anterior</th>
                    <th className="pb-3">Stock Nuevo</th>
                    <th className="pb-3">Responsable</th>
                    <th className="pb-3">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {kardexData?.map((entry: any) => (
                    <tr key={entry.id} className="border-b text-sm">
                      <td className="py-3">
                        {new Date(entry.created_at).toLocaleString("es-CL", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{entry.insumos?.nombre}</p>
                          <p className="text-xs text-gray-500">{entry.insumos?.codigo}</p>
                        </div>
                      </td>
                      <td className="py-3">{getMovementBadge(entry.tipo_movimiento)}</td>
                      <td className="py-3 font-semibold">
                        {entry.tipo_movimiento === "entrada" ? "+" : "-"}
                        {entry.cantidad}
                      </td>
                      <td className="py-3 text-gray-600">{entry.stock_anterior}</td>
                      <td className="py-3 font-semibold">{entry.stock_nuevo}</td>
                      <td className="py-3">{entry.profiles?.full_name || "Sistema"}</td>
                      <td className="py-3 text-gray-600">{entry.observaciones || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!kardexData ||
                (kardexData.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-500">No hay movimientos registrados</p>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
