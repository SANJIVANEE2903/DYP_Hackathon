const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const { createClient } = require('@supabase/supabase-js')
const { getGitHubService } = require('../services/github')
const { detectStack } = require('../services/ai')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// GET /api/repos - list all repos for current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data: repos, error } = await supabase
      .from('repos')
      .select('*')
      .eq('owner_id', req.user.userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    res.json(repos || [])
  } catch (err) {
    console.error('GET /repos error:', err)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/repos/connect - connect a GitHub repo
router.post('/connect', requireAuth, async (req, res) => {
  try {
    const { repoFullName } = req.body
    if (!repoFullName) {
      return res.status(400).json({ error: 'repoFullName is required' })
    }

    const [owner, repoName] = repoFullName.split('/')
    if (!owner || !repoName) {
      return res.status(400).json({ error: 'Invalid repo format. Use owner/repo' })
    }

    const accessToken = req.user.githubAccessToken

    // Try authenticated request first; fall back to public API for public repos
    let repoData = null
    if (accessToken) {
      const gh = getGitHubService(accessToken)
      repoData = await gh.getRepoDetails(owner, repoName)
    }

    // Public API fallback — works for any public repo without OAuth
    if (!repoData) {
      try {
        const publicRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
          headers: { 'User-Agent': 'RepoForge-Backend', 'Accept': 'application/vnd.github.v3+json' }
        })
        if (publicRes.ok) repoData = await publicRes.json()
      } catch (e) { /* ignore */ }
    }

    if (!repoData || !repoData.id) {
      return res.status(404).json({ error: `Repository "${repoFullName}" not found on GitHub. Check the name and try again.` })
    }

    // Detect stack from root files
    let stack = 'generic'
    try {
      const gh = getGitHubService(accessToken || '')
      const rootFiles = await gh.listRootFiles(owner, repoName)
      const stackResult = await detectStack(rootFiles, {})
      stack = stackResult.stack
    } catch (aiErr) {
      console.warn('Stack detection skipped:', aiErr.message)
    }

    // Ensure user exists in public.users table
    let github_id = 0
    if (accessToken) {
      try {
        const gh = getGitHubService(accessToken)
        const ghUser = await gh._request('/user')
        if (ghUser?.id) github_id = ghUser.id
      } catch (e) { /* ignore */ }
    }

    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: req.user.userId,
        github_id,
        login: req.user.githubLogin,
        email: req.user.email,
        avatar_url: req.user.avatarUrl
      }, { onConflict: 'id' })

    if (userError) console.warn('User upsert error (non-fatal):', userError.message)

    // Save the repo  
    const { data: repo, error } = await supabase
      .from('repos')
      .upsert({
        github_id: repoData.id,
        name: repoData.name,
        full_name: repoData.full_name,
        is_private: repoData.private,
        stack,
        owner_id: req.user.userId,
        updated_at: new Date().toISOString()
      }, { onConflict: 'github_id' })
      .select()
      .single()

    if (error) throw error
    res.json({ repo, stack })
  } catch (err) {
    console.error('POST /repos/connect error:', err)
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/repos/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('repos')
      .delete()
      .eq('id', req.params.id)
      .eq('owner_id', req.user.userId)

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
