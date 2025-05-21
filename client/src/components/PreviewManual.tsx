import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchManualWithPages } from "../DB/fetchManualWithPages"
import { ManualLayout } from '@/types/ManualLayout'
import { PreviewManualBook } from './PreviewManualBook'

export default function PreviewManual() {
  const { manualId } = useParams()
  const navigate = useNavigate()
  const [manual, setManual] = useState<ManualLayout | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchManual = async () => {
      try {
        const layout = await fetchManualWithPages(`${manualId}`)
        if (!layout) throw new Error("Failed to fetch manual")
        setManual(layout)
      } catch (err) {
        console.error(err)
        navigate("/404") // Or show an error page
      } finally {
        setLoading(false)
      }
    };

    if (manualId) fetchManual()
  }, [manualId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading manual...
      </div>
    );
  }

  if (!manual) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Manual not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(`/${manual.id}`)}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          Back to editor
        </button>
      </div>

      <div>
    {manual ? (
      <PreviewManualBook layout={manual}  />
    ) : (
      <div className="text-center mt-10">Loading manual...</div>
    )}
  </div>
    </div>
  );
}