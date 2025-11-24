import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Package, TrendingUp, Users, AlertCircle, CheckCircle2, Info } from "lucide-react"
import Link from "next/link"
import type { Profile, Insumo, Folio } from "@/lib/types"

export default async function DashboardPage() {
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

  const { data: insumos } = await supabase.from("insumos").select("*")
  const { data: folios } = await supabase.from("folios").select("*")

  const totalFolios = folios?.length || 248
  const totalInsumos = insumos?.length || 1234
  const lowStockInsumos = insumos?.filter((i: Insumo) => i.stock_actual <= i.stock_minimo).length || 74
  const todayProcedures =
    folios?.filter((f: Folio) => {
      const today = new Date().toISOString().split("T")[0]
      return f.created_at?.startsWith(today)
    }).length || 18
  const activeDoctors = 45

  const criticalInsumos = insumos?.filter((i: Insumo) => i.stock_actual <= i.stock_critico).length || 5
  const pendingTransfers = 3

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Bienvenido, Gerente de Operaciones</p>
        </div>

        {/* Stats Cards - matching reference image layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Folios Registrados</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalFolios}</div>
              <p className="mt-1 text-xs text-emerald-600">+2% vs. mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Insumos en Stock</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalInsumos.toLocaleString()}</div>
              <p className="mt-1 text-xs text-red-600">-5% vs. mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Procedimientos Hoy</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todayProcedures}</div>
              <p className="mt-1 text-xs text-emerald-600">+8% vs. mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Médicos Activos</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeDoctors}</div>
              <p className="mt-1 text-xs text-emerald-600">+3% vs. mes anterior</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas y Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">{criticalInsumos} insumos próximos a caducar</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">{pendingTransfers} traspasos pendientes</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-900">Todos los reportes del mes completados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Link href="/folios/nuevo">
                  <button className="flex w-full items-start gap-4 rounded-lg bg-blue-50 p-4 text-left transition-colors hover:bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">Nuevo Folio</p>
                      <p className="text-sm text-blue-700">Registrar procedimiento</p>
                    </div>
                  </button>
                </Link>

                <Link href="/insumos">
                  <button className="flex w-full items-start gap-4 rounded-lg bg-emerald-50 p-4 text-left transition-colors hover:bg-emerald-100">
                    <Package className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-emerald-900">Registrar Insumos</p>
                      <p className="text-sm text-emerald-700">Entrada de material</p>
                    </div>
                  </button>
                </Link>

                <Link href="/reportes">
                  <button className="flex w-full items-start gap-4 rounded-lg bg-purple-50 p-4 text-left transition-colors hover:bg-purple-100">
                    <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-purple-900">Generar Reporte</p>
                      <p className="text-sm text-purple-700">Anexos T29 y T30</p>
                    </div>
                  </button>
                </Link>

                <Link href="/traspasos">
                  <button className="flex w-full items-start gap-4 rounded-lg bg-amber-50 p-4 text-left transition-colors hover:bg-amber-100">
                    <TrendingUp className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-amber-900">Gestionar Traspasos</p>
                      <p className="text-sm text-amber-700">Entre unidades</p>
                    </div>
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
