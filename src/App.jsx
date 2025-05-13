import ManualEditor from './components/ManualEditor'
import AuthPanel from './components/AuthPanel'
import './App.css'
import { useEffect, useState } from 'react'
import { supabase } from './DB/supabaseClient'

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
    <div className="flex flex-col min-h-screen bg-gray-100">
      {session ? <ManualEditor /> : <AuthPanel />}
    </div>
  )
}

export default App
