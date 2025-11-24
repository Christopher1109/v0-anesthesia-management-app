import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus } from "lucide-react"
import type { Profile } from "@/lib/types"

export default async function TransferenciasPage() {
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

  const { data: transferencias } = await supabase
    .from("transferencias")
    .select(`
      *,
      solicitante:profiles!transferencias_solicitante_id_fkey (full_name),
      receptor:profiles!transferencias_receptor_id_fkey (full_name)
    `)
    .order("created_at", { ascending: false })

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge className="bg-yellow-600">Pendiente</Badge>
      case "en_transito":
        return <Badge className="bg-blue-600">En Tránsito</Badge>
      case "recibida":
        return <Badge className="bg-green-600">Recibida</Badge>
      case "rechazada":
        return <Badge className="bg-red-600">Rechazada</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar profile={profile} />

      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transferencias</h1>
            <p className="mt-2 text-gray-600">Gestión de transferencias entre unidades</p>
          </div>
          <Link href="/transferencias/nueva">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Transferencia
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Transferencias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-gray-600">
                    <th className="pb-3">Nº Transferencia</th>
                    <th className="pb-3">Origen</th>
                    <th className="pb-3">Destino</th>
                    <th className="pb-3">Solicitante</th>
                    <th className="pb-3">Fecha Solicitud</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3">Receptor</th>
                  </tr>
                </thead>
                <tbody>
                  {transferencias?.map((trans: any) => (
                    <tr key={trans.id} className="border-b text-sm">
                      <td className="py-3 font-medium text-blue-600">{trans.numero_transferencia}</td>
                      <td className="py-3">{trans.origen}</td>
                      <td className="py-3">{trans.destino}</td>
                      <td className="py-3">{trans.solicitante?.full_name || "-"}</td>
                      <td className="py-3">
                        {new Date(trans.fecha_solicitud).toLocaleString("es-CL", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-3">{getEstadoBadge(trans.estado)}</td>
                      <td className="py-3">{trans.receptor?.full_name || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!transferencias ||
                (transferencias.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-500">No hay transferencias registradas</p>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
