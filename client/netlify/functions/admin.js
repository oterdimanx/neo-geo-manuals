import { createClient } from '@supabase/supabase-js'

export const handler = async (event) => {
  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_SERVICE_KEY
    )

    const token = event.headers.authorization?.split('Bearer ')[1]
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "No token provided" }),
        headers: { 'Content-Type': 'application/json' }
      }
    }

    const { data } = await supabase.from('profiles').select('*')
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: { 'Content-Type': 'application/json' }
    }
  }
}