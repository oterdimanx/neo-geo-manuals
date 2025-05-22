import { useState, useEffect } from 'react'
import { supabase } from '../DB/supabaseClient'

export default function AuthPanel() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState<any>(null)
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (session) {
    return (
      <div className="p-4">
        <p className="mb-2">Logged in as: {session.user.email}</p>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 text-white rounded">Logout</button>
      </div>
    )
  }

  return (
    <><div className="relative w-full overflow-hidden">
    </div><div className="relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow max-w-sm">
          <h2 className="text-xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full transform-gpu"
            required />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full transform-gpu"
            required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          <p
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm cursor-pointer text-blue-500 text-center"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </p>
        </form>
      </div></>




  )
}