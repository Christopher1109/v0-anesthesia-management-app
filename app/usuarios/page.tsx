import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Shield } from "lucide-react"
import type { Profile } from "@/lib/types"

export default async function UsuariosPage() {
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

  // Only managers can see this page
  if (profile.role !== "gerente" && profile.role !== "gerente_operaciones") {
    redirect("/dashboard")
  }

  const { data: users } = await supabase.from("profiles").select("*").order("full_name")

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "gerente":
      case "gerente_operaciones":
        return "bg-purple-100 text-purple-700"
      case "supervisor":
        return "bg-blue-100 text-blue-700"
      case "lider":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
            <p className="mt-2 text-muted-foreground">Gestión de personal y accesos</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o correo..." className="pl-10" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users?.map((userProfile: Profile) => (
            <Card key={userProfile.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://avatar.vercel.sh/${userProfile.email}`} />
                      <AvatarFallback>{userProfile.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{userProfile.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className={getRoleBadge(userProfile.role)}>
                    {userProfile.role.replace("_", " ")}
                  </Badge>
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Último acceso</span>
                    <span className="font-medium">Hace 2 horas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
