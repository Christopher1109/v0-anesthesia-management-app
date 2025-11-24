"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Insumo } from "@/lib/types"

type InsumoItem = {
  insumo_id: string
  cantidad: number
}

export function NuevoFolioForm({ userId, insumos }: { userId: string; insumos: Insumo[] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    numero_folio: `FOL-${Date.now()}`,
    paciente_nombre: "",
    paciente_rut: "",
    fecha_cirugia: "",
    hora_cirugia: "",
    tipo_cirugia: "",
    anestesiologo: "",
    pabellon: "",
    observaciones: "",
  })

  const [items, setItems] = useState<InsumoItem[]>([])

  const addItem = () => {
    setItems([...items, { insumo_id: "", cantidad: 1 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof InsumoItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Create folio
      const { data: folio, error: folioError } = await supabase
        .from("folios")
        .insert({
          ...formData,
          created_by: userId,
          estado: "pendiente",
        })
        .select()
        .single()

      if (folioError) throw folioError

      // Create folio details and update stock
      for (const item of items) {
        if (!item.insumo_id || item.cantidad <= 0) continue

        // Insert folio detail
        const { error: detailError } = await supabase.from("folio_detalles").insert({
          folio_id: folio.id,
          insumo_id: item.insumo_id,
          cantidad: item.cantidad,
        })

        if (detailError) throw detailError

        // Get current stock
        const { data: insumo, error: insumoError } = await supabase
          .from("insumos")
          .select("stock_actual")
          .eq("id", item.insumo_id)
          .single()

        if (insumoError) throw insumoError

        const newStock = insumo.stock_actual - item.cantidad

        // Update stock
        const { error: updateError } = await supabase
          .from("insumos")
          .update({ stock_actual: newStock })
          .eq("id", item.insumo_id)

        if (updateError) throw updateError

        // Create kardex entry
        const { error: kardexError } = await supabase.from("kardex").insert({
          insumo_id: item.insumo_id,
          tipo_movimiento: "salida",
          cantidad: item.cantidad,
          stock_anterior: insumo.stock_actual,
          stock_nuevo: newStock,
          folio_id: folio.id,
          responsable_id: userId,
          observaciones: `Consumo en folio ${formData.numero_folio}`,
        })

        if (kardexError) throw kardexError
      }

      router.push("/folios")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear folio")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Paciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="numero_folio">Número de Folio</Label>
                <Input
                  id="numero_folio"
                  value={formData.numero_folio}
                  onChange={(e) => setFormData({ ...formData, numero_folio: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="paciente_rut">RUT Paciente</Label>
                <Input
                  id="paciente_rut"
                  value={formData.paciente_rut}
                  onChange={(e) => setFormData({ ...formData, paciente_rut: e.target.value })}
                  placeholder="12.345.678-9"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="paciente_nombre">Nombre del Paciente</Label>
              <Input
                id="paciente_nombre"
                value={formData.paciente_nombre}
                onChange={(e) => setFormData({ ...formData, paciente_nombre: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="fecha_cirugia">Fecha de Cirugía</Label>
                <Input
                  id="fecha_cirugia"
                  type="date"
                  value={formData.fecha_cirugia}
                  onChange={(e) => setFormData({ ...formData, fecha_cirugia: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="hora_cirugia">Hora de Cirugía</Label>
                <Input
                  id="hora_cirugia"
                  type="time"
                  value={formData.hora_cirugia}
                  onChange={(e) => setFormData({ ...formData, hora_cirugia: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tipo_cirugia">Tipo de Cirugía</Label>
              <Input
                id="tipo_cirugia"
                value={formData.tipo_cirugia}
                onChange={(e) => setFormData({ ...formData, tipo_cirugia: e.target.value })}
                placeholder="Ej: Apendicectomía"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="anestesiologo">Anestesiólogo</Label>
                <Input
                  id="anestesiologo"
                  value={formData.anestesiologo}
                  onChange={(e) => setFormData({ ...formData, anestesiologo: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pabellon">Pabellón</Label>
                <Input
                  id="pabellon"
                  value={formData.pabellon}
                  onChange={(e) => setFormData({ ...formData, pabellon: e.target.value })}
                  placeholder="Ej: Pabellón 1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Insumos Utilizados</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Insumo
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1">
                    <Select value={item.insumo_id} onValueChange={(value) => updateItem(index, "insumo_id", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar insumo" />
                      </SelectTrigger>
                      <SelectContent>
                        {insumos.map((insumo) => (
                          <SelectItem key={insumo.id} value={insumo.id}>
                            {insumo.nombre} - Stock: {insumo.stock_actual}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => updateItem(index, "cantidad", Number.parseInt(e.target.value))}
                      placeholder="Cantidad"
                    />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {items.length === 0 && <p className="py-4 text-center text-sm text-gray-500">No hay insumos agregados</p>}
            </div>
          </CardContent>
        </Card>

        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/folios")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Folio"}
          </Button>
        </div>
      </div>
    </form>
  )
}
