import { supabase } from "./supabaseClient"

export async function fetchManualsByUser(userId: string) {
  const { data, error } = await supabase
    .from("manuals")
    .select("id, title, created_at, updated_at") // Add more fields if needed
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching manuals:", error)
    return []
  }

  return data
}
