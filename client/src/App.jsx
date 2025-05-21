import { Routes, Route } from 'react-router-dom'
import ManualEditor from './components/ManualEditor'
import AuthPanel from './components/AuthPanel'
import './App.css'
import { useEffect, useState } from 'react'
import { supabase } from './DB/supabaseClient'
import PreviewManual from './components/PreviewManual'
import NotFound from './components/NotFound'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    fetchSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        {!session ? (
          <AuthPanel />
        ) : (
          <Routes>
            <Route path="/" element={<ManualEditor />} />
            <Route path="/:manualId" element={<ManualEditor />} />
            <Route path="/preview/:manualId" element={<PreviewManual />} />
            <Route path="/404" element={<NotFound />} /> {/* When redirection page is needed */}
            <Route path="*" element={<NotFound />} /> {/* Catch-all */}
          </Routes>
        )}
      </div>
    </div>
  )
}

export default App
