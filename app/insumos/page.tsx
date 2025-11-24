import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Grid3x3, List } from "lucide-react"
import type { Profile, Insumo } from "@/lib/types"

export default async function InsumosPage() {
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

  const { data: insumos } = await supabase.from("insumos").select("*").order("nombre")

  const getStockStatus = (insumo: Insumo) => {
    if (insumo.stock_actual <= insumo.stock_critico) {
      return { label: "Crítico", variant: "destructive" as const, color: "text-red-600" }
    } else if (insumo.stock_actual <= insumo.stock_minimo) {
      return { label: "Bajo", variant: "secondary" as const, color: "text-amber-600" }
    }
    return { label: "Normal", variant: "default" as const, color: "text-emerald-600" }
  }

  const totalInsumos = insumos?.length || 0
  const stockBajo = insumos?.filter((i: Insumo) => i.stock_actual <= i.stock_minimo).length || 0
  const proximosVencer = 15

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventario de Insumos</h1>
            <p className="mt-2 text-muted-foreground">Gestiona el inventario de insumos médicos del hospital</p>
          </div>
          {(profile.role === "bodega" ||
            profile.role === "lider" ||
            profile.role === "supervisor" ||
            profile.role === "gerente") && (
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Registrar Insumo
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Registros en Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalInsumos}</div>
              <p className="mt-1 text-xs text-muted-foreground">Registros activos en inventario</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Stock Bajo</CardTitle>
              <span className="text-2xl text-amber-500">⚠</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stockBajo}</div>
              <p className="mt-1 text-xs text-muted-foreground">Requieren reabastecimiento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Próximos a Vencer</CardTitle>
              <span className="text-2xl">📅</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{proximosVencer}</div>
              <p className="mt-1 text-xs text-muted-foreground">Menos de 60 días</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nombre, clave o lote..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Stock Bajo
            </Button>
            <Button variant="outline" size="sm">
              Solo Insumos
            </Button>
            <Button variant="outline" size="sm">
              Solo Medicamentos
            </Button>
          </div>
          <div className="flex gap-1 border rounded-md">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insumos?.map((insumo: Insumo) => {
            const status = getStockStatus(insumo)
            return (
              <Card key={insumo.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg leading-tight mb-1">{insumo.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{insumo.categoria}</p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Clave</span>
                      <p className="font-medium">{insumo.codigo || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tipo</span>
                      <p className="font-medium">{insumo.categoria}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Lote</span>
                      <p className="font-medium">{insumo.ubicacion || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stock Actual</span>
                      <p className={`font-bold text-lg ${status.color}`}>{insumo.stock_actual}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {(!insumos || insumos.length === 0) && (
          <Card className="p-12">
            <p className="text-center text-muted-foreground">No hay insumos registrados</p>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
