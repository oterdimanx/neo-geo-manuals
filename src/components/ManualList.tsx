import { useEffect, useState } from "react"
import { supabase } from "../DB/supabaseClient"
import { fetchManualsByUser } from "../DB/fetchManualsByUser"
import { fetchManualWithPages } from "../DB/fetchManualWithPages"

type Manual = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export default function ManualList({ onSelect }: { onSelect: (manual: any) => void }) {
  const [manuals, setManuals] = useState<Manual[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const id = session?.user?.id
      if (id) {
        setUserId(id)
        const manuals = await fetchManualsByUser(id)
        setManuals(manuals)
      }
    }

    loadSession()
  }, [])

  const handleSelectManual = async (manualId: string) => {
    const layout = await fetchManualWithPages(manualId)
    if (layout) {
      onSelect(layout)
    } else {
      console.error("Failed to fetch manual layout")
    }
  }

  const createNewManual = async () => {
    if (!userId) return
  
    // Insert a new manual
    const { data, error } = await supabase
      .from("manuals")
      .insert([
        {
          title: "Untitled Manual",
          user_id: userId,
        },
      ])
      .select()
      .single()
  
    if (error || !data) {
      console.error("Failed to create manual", error)
      return
    }

    const manualId = data.id

    // insert a page linked to the new manual
    const { error: pageError } = await supabase.from('pages').insert([
      {
        manual_id: manualId,
        background_color: null,
        page_order: 0,
      }
    ])

    if(pageError) {
      console.error('Failed to create initial page for manual: ', pageError)
      return
    }

    // Fetch the newly created manual layout
    const newManual = await fetchManualWithPages(data.id)
    onSelect(newManual)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Your Manuals</h2>
      <select className="border rounded px-2 py-1" onChange={(e) => handleSelectManual(e.target.value)}>
        <option value="" disabled>
          Select a manual...
        </option>
        {manuals.map((manual) => (
          <option key={manual.id} value={manual.id}>
            {manual.title}
          </option>
        ))}
      </select>
      <button
        className="bg-green-600 text-white px-3 py-1 rounded mb-4 hover:bg-green-700"
        onClick={createNewManual}
      >
        + New Manual
      </button>
    </div>
  );
}