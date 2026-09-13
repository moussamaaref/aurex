import { supabase } from "../../../lib/supabase"

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

export async function uploadToAurexMedia(file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.")
  if (!file.type.startsWith("image/")) throw new Error("Le fichier doit être une image.")
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image trop lourde (max 8 Mo).")
  const ext = file.name.split(".").pop() || "jpg"
  const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
  const objectName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${
    safe || `file.${ext}`
  }`
  const { error } = await supabase.storage
    .from("aurex-media")
    .upload(objectName, file, { cacheControl: "3600", upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from("aurex-media").getPublicUrl(objectName)
  return data.publicUrl
}
