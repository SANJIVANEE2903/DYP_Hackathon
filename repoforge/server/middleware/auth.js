const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Auth middleware: No Bearer token provided in header');
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    
    // Use getUser to verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      console.error('Auth middleware: Supabase auth error or user not found:', error?.message || 'User null');
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Get GitHub access token from user metadata
    // Supabase stores provider tokens in metadata if configured
    req.user = {
      userId: user.id,
      githubLogin: user.user_metadata?.user_name || user.user_metadata?.preferred_username,
      githubAccessToken: req.headers['x-github-token'] || 
                         user.user_metadata?.provider_token || 
                         user.app_metadata?.provider_token,
      email: user.email,
      avatarUrl: user.user_metadata?.avatar_url
    }

    next()
  } catch (err) {
    console.error('Critical auth middleware error:', err)
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

module.exports = { requireAuth }
