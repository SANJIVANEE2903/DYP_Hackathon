const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const db = require('../db/database')
const { getGitHubService } = require('../services/github')
const { detectStack } = require('../services/ai')

/**
 * GET /api/repos
 * List all repos for the current user
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const repos = await db.repos.findByOwnerId(req.user.userId)
    res.json(repos)
  } catch (err) {
    console.error('GET /repos error:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/repos/connect
 * Connect a GitHub repo to RepoForge
 */
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
    const gh = getGitHubService(accessToken || '')
    
    // Fetch repo details from GitHub
    let repoData = null
    try {
      repoData = await gh.getRepoDetails(owner, repoName)
    } catch (e) {
      // Fallback for public repos if token is missing/invalid
      const publicRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
        headers: { 'User-Agent': 'RepoForge-Backend' }
      })
      if (publicRes.ok) repoData = await publicRes.json()
    }

    if (!repoData || !repoData.id) {
      return res.status(404).json({ error: `Repository "${repoFullName}" not found on GitHub.` })
    }

    // AI Stack Detection
    let stack = 'generic'
    try {
      const rootFiles = await gh.listRootFiles(owner, repoName)
      const stackResult = await detectStack(rootFiles, {})
      stack = stackResult.stack
    } catch (aiErr) {
      console.warn('AI Stack Detection failed:', aiErr.message)
    }

    // Upsert the repository in Supabase
    const repo = await db.repos.upsert({
      github_id: repoData.id,
      name: repoData.name,
      full_name: repoData.full_name,
      is_private: repoData.private,
      stack,
      owner_id: req.user.userId
    })

    res.json({ repo, stack })
  } catch (err) {
    console.error('POST /repos/connect error:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * DELETE /api/repos/:id
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    // In Supabase we use the client directly for delete for now as we didn't add it to abstraction
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    
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
