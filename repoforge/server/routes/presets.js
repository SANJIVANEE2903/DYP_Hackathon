const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const db = require('../db/database')

/**
 * GET /api/presets
 * List all presets for the current user
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const presets = await db.presets.findByOwnerId(req.user.userId)
    res.json(presets)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/presets
 * Create a new preset
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, orgName, config } = req.body
    const preset = await db.presets.create({
      name,
      orgName,
      ownerId: req.user.userId,
      config
    })
    res.json(preset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * PUT /api/presets/:id
 * Update an existing preset
 */
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const preset = await db.presets.update(req.params.id, req.body)
    res.json(preset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * DELETE /api/presets/:id
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.presets.delete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/presets/:id/apply
 * Apply a preset to specific repositories
 */
router.post('/:id/apply', requireAuth, async (req, res) => {
  try {
    const { repoIds } = req.body
    const preset = await db.presets.findById(req.params.id)
    
    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' })
    }

    const results = []
    const { getGitHubService } = require('../services/github')
    const { detectStack } = require('../services/ai')
    const { initializeRepo } = require('../services/initializer')

    for (const repoId of repoIds) {
      const repo = await db.repos.findById(repoId)
      if (!repo) continue

      const [owner, repoName] = repo.full_name.split('/')
      const gh = getGitHubService(req.user.githubAccessToken)
      
      const rootFiles = await gh.listRootFiles(owner, repoName)
      const stackResult = await detectStack(rootFiles, {})

      const result = await initializeRepo({
        owner, 
        repo: repoName,
        accessToken: req.user.githubAccessToken,
        preset: typeof preset.config === 'string' ? JSON.parse(preset.config) : preset.config,
        detectedStack: stackResult
      })
      results.push(result)
    }

    await db.presets.incrementApplied(req.params.id)
    res.json({ applied: repoIds.length, results })
  } catch (err) {
    console.error('Preset Apply Error:', err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
