const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('presets')
    .select('*')
    .eq('user_id', req.user.userId)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data || [])
})

router.post('/', requireAuth, async (req, res) => {
  const { name, orgName, config } = req.body
  const { data, error } = await supabase
    .from('presets')
    .insert({ name, org_name: orgName, owner_id: req.user.userId, config })
    .select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.put('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('presets')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('owner_id', req.user.userId)
    .select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('presets')
    .delete()
    .eq('id', req.params.id)
    .eq('owner_id', req.user.userId)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})

router.post('/:id/apply', requireAuth, async (req, res) => {
  try {
    const { repoIds } = req.body
    const { data: preset } = await supabase
      .from('presets').select('*').eq('id', req.params.id).single()

    const results = []
    for (const repoId of repoIds) {
      const { data: repo } = await supabase
        .from('repos').select('*').eq('id', repoId).single()

      const [owner, repoName] = repo.full_name.split('/')
      const { getGitHubService } = require('../services/github')
      const { detectStack } = require('../services/ai')
      const { initializeRepo } = require('../services/initializer')

      const gh = getGitHubService(req.user.githubAccessToken)
      const rootFiles = await gh.listRootFiles(owner, repoName)
      const stackResult = await detectStack(rootFiles, {})

      const result = await initializeRepo({
        owner, repo: repoName,
        accessToken: req.user.githubAccessToken,
        preset: preset.config,
        detectedStack: stackResult
      })
      results.push(result)
    }

    await supabase.from('presets')
      .update({ applied_count: preset.applied_count + repoIds.length })
      .eq('id', req.params.id)

    res.json({ applied: repoIds.length, results })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
