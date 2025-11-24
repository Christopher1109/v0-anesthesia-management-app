import { createClient } from "@/lib/supabase/server"

/**
 * Obtiene el usuario autenticado actual
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
