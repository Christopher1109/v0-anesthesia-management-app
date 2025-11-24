import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Download, FileDown } from "lucide-react"
import type { Profile } from "@/lib/types"

export default async function ReportesPage() {
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

  const { data: folios } = await supabase.from("folios").select("*")
  const { data: insumos } = await supabase.from("insumos").select("*")

  const totalProcedimientos = folios?.length || 248
  const insumosUtilizados = 1234
  const medicosActivos = 45
  const foliosCancelados = 3

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
          <p className="mt-2 text-muted-foreground">Generación de anexos T29 y T30</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Anexo T29 */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Anexo T29</CardTitle>
                  <p className="text-sm text-muted-foreground">Listado de pacientes</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Genera el listado completo de pacientes atendidos en el período seleccionado, incluyendo datos del
                procedimiento, médicos involucrados y tipo de anestesia utilizada.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="t29-fecha-inicio">Fecha Inicio</Label>
                  <Input id="t29-fecha-inicio" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t29-fecha-fin">Fecha Fin</Label>
                  <Input id="t29-fecha-fin" type="date" />
                </div>
              </div>

              <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4" />
                Descargar Anexo T29
              </Button>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Últimas descargas:</p>
                <div className="space-y-1">
                  <p className="text-xs">• 01/11/2024 - Octubre 2024</p>
                  <p className="text-xs">• 01/10/2024 - Septiembre 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anexo T30 */}
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <FileDown className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Anexo T30</CardTitle>
                  <p className="text-sm text-muted-foreground">Listado de insumos</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Genera reporte detallado de todos los insumos utilizados en el período seleccionado, con información de
                lotes, cantidades consumidas y origen de los materiales.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="t30-fecha-inicio">Fecha Inicio</Label>
                  <Input id="t30-fecha-inicio" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t30-fecha-fin">Fecha Fin</Label>
                  <Input id="t30-fecha-fin" type="date" />
                </div>
              </div>

              <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Download className="h-4 w-4" />
                Descargar Anexo T30
              </Button>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Últimas descargas:</p>
                <div className="space-y-1">
                  <p className="text-xs">• 01/11/2024 - Octubre 2024</p>
                  <p className="text-xs">• 01/10/2024 - Septiembre 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas del Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Procedimientos</p>
                <p className="text-3xl font-bold">{totalProcedimientos}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Insumos Utilizados</p>
                <p className="text-3xl font-bold">{insumosUtilizados}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Médicos Activos</p>
                <p className="text-3xl font-bold">{medicosActivos}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Folios Cancelados</p>
                <p className="text-3xl font-bold">{foliosCancelados}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
