import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowLeftRight, CheckCircle2, Clock } from "lucide-react"
import type { Profile, Transferencia } from "@/lib/types"

export default async function TraspasosPage() {
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
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Traspasos</h1>
            <p className="mt-2 text-muted-foreground">Gestión de transferencias entre unidades</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Solicitud
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Solicitudes Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Envíos en Tránsito</CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completados (Mes)</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Traspasos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                    <th className="pb-3">Nº Transferencia</th>
                    <th className="pb-3">Origen</th>
                    <th className="pb-3">Destino</th>
                    <th className="pb-3">Fecha Solicitud</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {transferencias?.map((transferencia: Transferencia) => (
                    <tr key={transferencia.id} className="border-b text-sm">
                      <td className="py-3 font-medium">{transferencia.numero_transferencia}</td>
                      <td className="py-3">{transferencia.origen}</td>
                      <td className="py-3">{transferencia.destino}</td>
                      <td className="py-3">{new Date(transferencia.fecha_solicitud).toLocaleDateString()}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            transferencia.estado === "completado"
                              ? "default" // Changed from success to default
                              : transferencia.estado === "pendiente"
                                ? "secondary" // Changed from warning to secondary
                                : "destructive"
                          }
                          className={
                            transferencia.estado === "completado"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : transferencia.estado === "pendiente"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                          }
                        >
                          {transferencia.estado}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          Ver Detalle
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!transferencias || transferencias.length === 0) && (
                <p className="py-8 text-center text-sm text-muted-foreground">No hay transferencias registradas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
