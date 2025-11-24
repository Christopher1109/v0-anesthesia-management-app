"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  FileText,
  Package,
  Activity,
  Users,
  FileBox,
  BarChart3,
  ArrowLeftRight,
  Search,
  Download,
  Upload,
  LogOut,
  ChevronDown,
  Building2,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { Profile, Hospital } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  profile: Profile
  hospitals?: Hospital[]
  currentHospital?: Hospital
}

export function AppSidebar({ profile, hospitals = [], currentHospital }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [selectedHospital, setSelectedHospital] = useState(currentHospital)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      auxiliar: "Auxiliar Médico de Farmacia",
      bodega: "Almacenista",
      lider: "Líder de Sección",
      supervisor: "Supervisor",
      gerente: "Gerente de Operaciones",
    }
    return roles[role] || role
  }

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/folios", icon: FileText, label: "Folios" },
    { href: "/insumos", icon: Package, label: "Insumos" },
    { href: "/kardex", icon: Activity, label: "Kardex" },
    { href: "/medicos", icon: Users, label: "Médicos" },
    { href: "/paquetes", icon: FileBox, label: "Paquetes Anestesia" },
    { href: "/reportes", icon: BarChart3, label: "Reportes" },
    { href: "/traspasos", icon: ArrowLeftRight, label: "Traspasos" },
    { href: "/usuarios", icon: Users, label: "Usuarios" },
    { href: "/diagnostico", icon: Search, label: "Diagnóstico Insumos" },
  ]

  const formatHospitalLabel = (hospital: Hospital) => {
    return `${hospital.tipo} ${hospital.numero_clinica} ${hospital.localidad || hospital.estado}`
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-[#0f172a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <h1 className="text-lg font-semibold text-blue-400">Sistema Anestesia</h1>
      </div>

      {/* User Info */}
      <div className="border-b border-white/10 p-4">
        <p className="text-xs text-gray-400">Usuario actual</p>
        <p className="mt-1 font-medium">{getRoleLabel(profile.role)}</p>
      </div>

      {/* Hospital Selector */}
      {hospitals.length > 0 && (
        <div className="border-b border-white/10 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-left text-white hover:bg-white/10 hover:text-white"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm truncate">
                    {selectedHospital ? formatHospitalLabel(selectedHospital) : "Selecciona un hospital"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 max-h-96 overflow-y-auto">
              <div className="p-2">
                <p className="mb-2 text-xs text-muted-foreground">Selecciona un hospital</p>
                {hospitals.map((hospital) => (
                  <DropdownMenuItem
                    key={hospital.id}
                    onSelect={() => setSelectedHospital(hospital)}
                    className={cn(
                      "mb-1 cursor-pointer rounded-md p-2",
                      selectedHospital?.id === hospital.id && "bg-blue-100",
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{formatHospitalLabel(hospital)}</span>
                      <span className="text-xs text-muted-foreground">
                        {hospital.estado} • {hospital.numero_clinica}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-white/10 p-3 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white">
          <Download className="h-4 w-4" />
          <span className="text-sm">Exportar Usuarios</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white">
          <Upload className="h-4 w-4" />
          <span className="text-sm">Importar Sistema</span>
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  )
}
