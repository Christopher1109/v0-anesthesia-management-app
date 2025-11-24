"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Profile } from "@/lib/types"

export function NavBar({ profile }: { profile: Profile }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      auxiliar: "Auxiliar",
      bodega: "Bodega",
      lider: "Líder",
      supervisor: "Supervisor",
      gerente: "Gerente",
    }
    return roles[role] || role
  }

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-xl font-bold text-white">SA</span>
              </div>
              <span className="hidden text-xl font-semibold text-blue-900 sm:block">Sistema Anestesia</span>
            </Link>
            <div className="hidden space-x-4 md:flex">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/folios">
                <Button variant="ghost" size="sm">
                  Folios
                </Button>
              </Link>
              <Link href="/insumos">
                <Button variant="ghost" size="sm">
                  Insumos
                </Button>
              </Link>
              <Link href="/transferencias">
                <Button variant="ghost" size="sm">
                  Transferencias
                </Button>
              </Link>
              <Link href="/kardex">
                <Button variant="ghost" size="sm">
                  Kardex
                </Button>
              </Link>
              <Link href="/reportes">
                <Button variant="ghost" size="sm">
                  Reportes
                </Button>
              </Link>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{profile.full_name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                  <p className="text-xs text-blue-600 font-medium">{getRoleLabel(profile.role)}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
