const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const { createClient } = require('@supabase/supabase-js')
const { getGitHubService } = require('../services/github')
const { runAudit } = require('../services/audit')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// POST /api/audit/run
router.post('/run', requireAuth, async (req, res) => {
  try {
    const { repoId } = req.body
    if (!repoId) return res.status(400).json({ error: 'repoId required' })

    // Get repo from DB
    const { data: repo, error: repoErr } = await supabase
      .from('repos')
      .select('*')
      .eq('id', repoId)
      .eq('owner_id', req.user.userId)
      .single()

    if (repoErr || !repo) {
      return res.status(404).json({ error: 'Repo not found' })
    }

    const accessToken = req.user.githubAccessToken
    const gh = getGitHubService(accessToken)
    const [owner, repoName] = repo.full_name.split('/')

    // Run audit
    const result = await runAudit(
      { name: repo.name, fullName: repo.full_name, stack: repo.stack, owner, repo: repoName },
      gh
    )

    // Save audit run — store full result in results JSONB
    const { data: auditRun, error: auditErr } = await supabase
      .from('audit_runs')
      .insert({
        repo_id: repoId,
        score: result.score,
        status: 'completed',
        results: result  // store entire rich result object
      })
      .select()
      .single()

    if (auditErr) throw auditErr

    // Update repo health score (best-effort)
    try {
      await supabase
        .from('repos')
        .update({ health_score: result.score, last_audit_at: new Date().toISOString() })
        .eq('id', repoId)
    } catch (updateErr) {
      console.warn('Could not update health_score:', updateErr.message)
    }

    // Return flattened: DB row fields + all rich result fields
    res.json({ ...auditRun, ...result })
  } catch (err) {
    console.error('POST /audit/run error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/audit/:repoId - get latest audit
router.get('/:repoId', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('audit_runs')
      .select('*')
      .eq('repo_id', req.params.repoId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) return res.status(404).json({ error: 'No audit found' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/audit/:repoId/history
router.get('/:repoId/history', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('audit_runs')
      .select('id, score, grade, created_at')
      .eq('repo_id', req.params.repoId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    res.json(data || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/audit/fix - one click fix
router.post('/fix', requireAuth, async (req, res) => {
  try {
    const { repoId, checkId } = req.body
    
    const { data: repo } = await supabase
      .from('repos')
      .select('*')
      .eq('id', repoId)
      .single()

    const accessToken = req.user.githubAccessToken
    const gh = getGitHubService(accessToken)
    const [owner, repoName] = repo.full_name.split('/')
    const { getTemplate } = require('../services/templates')

    // Map checkId to specific fix
    const fixMap = {
      'no-branch-protection': async () => gh.setBranchProtection(owner, repoName),
      'no-cicd': async () => {
        const yaml = getTemplate(repo.stack?.toLowerCase().includes('python') ? 'python' : 
                                  repo.stack?.toLowerCase().includes('go') ? 'go' : 'node')
        await gh.createOrUpdateFile(owner, repoName, '.github/workflows/ci.yml', yaml, 'ci: add workflow')
      },
      'no-readme': async () => {
        const { generateReadme } = require('../services/ai')
        const content = await generateReadme(repoName, repo.stack || 'generic', [])
        await gh.createOrUpdateFile(owner, repoName, 'README.md', content, 'docs: generate README')
      },
      'no-security': async () => {
        const content = getTemplate('security').replace('{{REPO_NAME}}', repoName)
        await gh.createOrUpdateFile(owner, repoName, 'SECURITY.md', content, 'docs: add SECURITY.md')
      },
      'no-contributing': async () => {
        const content = getTemplate('contributing').replace('{{REPO_NAME}}', repoName)
        await gh.createOrUpdateFile(owner, repoName, 'CONTRIBUTING.md', content, 'docs: add CONTRIBUTING.md')
      },
    }

    const fixFn = fixMap[checkId]
    if (!fixFn) return res.status(400).json({ error: `Unknown check: ${checkId}` })

    await fixFn()

    // Re-run audit after fix
    const { runAudit } = require('../services/audit')
    const result = await runAudit(
      { name: repo.name, fullName: repo.full_name, stack: repo.stack, owner, repo: repoName },
      gh
    )

    await supabase.from('audit_runs').insert({
      repo_id: repoId, user_id: req.user.userId,
      score: result.score, grade: result.grade,
      issues: result.issues, passed_checks: result.passedChecks,
      summary: result.summary
    })

    await supabase.from('repos')
      .update({ health_score: result.score })
      .eq('id', repoId)

    res.json({ success: true, newScore: result.score, result })
  } catch (err) {
    console.error('POST /audit/fix error:', err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
