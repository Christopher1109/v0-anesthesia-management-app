import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/app-sidebar"
import { Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import type { Profile, Hospital } from "@/lib/types"

interface AppLayoutProps {
  children: React.ReactNode
}

export async function AppLayout({ children }: AppLayoutProps) {
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

  // Get hospitals for selector
  const { data: hospitals } = await supabase.from("hospitales").select("*").order("estado").limit(20)

  const currentHospital = hospitals?.[0] as Hospital | undefined

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar profile={profile} hospitals={hospitals || []} currentHospital={currentHospital} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-100">
                <Building2 className="h-3 w-3" />
              </span>
              {currentHospital && (
                <span className="font-medium text-foreground">
                  {currentHospital.tipo} {currentHospital.numero_clinica} {currentHospital.localidad}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
