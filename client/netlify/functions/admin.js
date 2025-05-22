import { createClient } from '@supabase/supabase-js';

export async function handler(event) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
  
  // Verify JWT from cookies
  const { user } = await supabase.auth.api.getUser(event.headers.cookie);
  
  if (!user || !(await isAdmin(user.id))) {
    return { statusCode: 403 };
  }

  // Fetch subscriptions
  const { data } = await supabase
    .from('profiles')
    .select('id, email, subscription_status, created_at');

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}

async function isAdmin(userId) {
  const { data } = await supabase
    .from('user_roles')
    .select()
    .eq('user_id', userId)
    .eq('role', 'admin');
    
  return data.length > 0;
}