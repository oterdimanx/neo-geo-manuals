import { Routes, Route } from 'react-router-dom'
import ManualEditor from './components/ManualEditor'
import AuthPanel from './components/AuthPanel'
import './App.css'
import { useEffect, useState } from 'react'
import { supabase } from './DB/supabaseClient'
import PreviewManual from './components/PreviewManual'
import NotFound from './components/NotFound'
import DropletBackground from './components/DropletBackground'
import AdminDashboard from './components/AdminDashboard'

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

  const extraClasses = session ? `bg-gradient-to-br from-gray-100 to-gray-300` : `opacity-75`

  return (
    <><div className={`flex items-center justify-center flex-col min-h-screen ` + extraClasses}>
      <Routes>
        <Route path="/404" element={<NotFound className="w-full max-w-6xl" />} />
        <Route path="*" element={<div className="bg-white p-6 rounded-lg shadow-md">
          {!session ? (
            <><DropletBackground count={200} /><AuthPanel /></>
          ) : (
            <Routes>
              <Route path="/" element={<ManualEditor />} />
              <Route path="/:manualId" element={<ManualEditor />} />
              <Route path="/preview/:manualId" element={<PreviewManual />} />
              <Route path="/admin" element={
                <RequireAuth>
                  <AdminDashboard />
                </RequireAuth>
              } />
            </Routes>
          )}
        </div>} />
      </Routes>
    </div>
    <footer className="w-full text-center py-4 text-sm text-neutral-400 border-t border-neutral-700">
        <div className="relative inline">
          © {new Date().getFullYear()} Neo Geo Manuals - Built with React, Tailwind, and Supabase.
        </div>
        <div className="relative inline">
          <div className="front relative bg-[#222] text-lime-500 text-[8vh] font-black font-serif">
            <div className="absolute top-0 left-0 w-full h-full animate-apptitle"
              style={{
                background: 'radial-gradient(circle, #222 40%, transparent 40%)',
                backgroundSize: '.5vh .5vh',
                backgroundPosition: '-.5vh',
              }} />
            <div className="absolute top-[50px] left-[10px] w-full h-full text-[#222] [text-shadow:-10px_0px_lime,-1px_-1px_lime,-8px_8px_lime]">
              <div className="font-pixel">Manual Editor</div>
              <div className="droplet absolute left-[64%] top-[77px] transform -translate-x-1/2 mt-2 w-2 h-2 bg-lime-500 rounded-full animate-drip" />
            </div>
          </div>
        </div>
    </footer></>
  )
}

// RequireAuth component
const RequireAuth = ({ children }) => {
/*
  if (!session) return <Navigate to="/auth" />;
  if (!isAdmin(session.user.id)) return <Navigate to="/" />;
  */
  return children;
};

export default App
