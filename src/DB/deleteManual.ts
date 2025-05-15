import { supabase } from "./supabaseClient"

export default async function deleteManual(manualId: string) {
    const { error } = await supabase
    .from("manuals")
    .delete()
    .eq("id", manualId)
  
  if (error) {
    console.error("Failed to delete manual:", error)
  }
}