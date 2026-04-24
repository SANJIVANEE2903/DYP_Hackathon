const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const db = require('../db/database')
const { getGitHubService } = require('../services/github')
const { runAudit } = require('../services/audit')

/**
 * POST /api/audit/run
 * Trigger a health audit for a repository
 */
router.post('/run', requireAuth, async (req, res) => {
  try {
    const { repoId } = req.body
    if (!repoId) return res.status(400).json({ error: 'repoId required' })

    const repo = await db.repos.findById(repoId)
    if (!repo || repo.owner_id !== req.user.userId) {
      return res.status(404).json({ error: 'Repository not found' })
    }

    const accessToken = req.user.githubAccessToken
    const gh = getGitHubService(accessToken)
    const [owner, repoName] = repo.full_name.split('/')

    // Run the actual audit logic
    const result = await runAudit(
      { 
        name: repo.name, 
        fullName: repo.full_name, 
        stack: repo.stack, 
        owner, 
        repo: repoName 
      },
      gh
    )

    // Save audit results to Supabase
    const auditRun = await db.auditRuns.create({
      repoId,
      userId: req.user.userId,
      score: result.score,
      issues: result.issues,
      passedChecks: result.passedChecks,
      summary: result.summary
    })

    // Update the repository's cached health score
    await db.repos.updateScore(repoId, result.score)

    res.json({ ...auditRun, ...result })
  } catch (err) {
    console.error('Audit Run Error:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/audit/:repoId
 * Get the latest audit results for a repo
 */
router.get('/:repoId', requireAuth, async (req, res) => {
  try {
    const audit = await db.auditRuns.findLatestByRepoId(req.params.repoId)
    if (!audit) return res.status(404).json({ error: 'No audit history found' })
    res.json(audit)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/audit/:repoId/history
 */
router.get('/:repoId/history', requireAuth, async (req, res) => {
  try {
    const history = await db.auditRuns.findByRepoId(req.params.repoId)
    res.json(history)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/audit/fix
 * Apply an automated fix for a specific audit issue
 */
router.post('/fix', requireAuth, async (req, res) => {
  try {
    const { repoId, checkId } = req.body
    const repo = await db.repos.findById(repoId)
    if (!repo) return res.status(404).json({ error: 'Repo not found' })

    const accessToken = req.user.githubAccessToken
    const gh = getGitHubService(accessToken)
    const [owner, repoName] = repo.full_name.split('/')
    const { getTemplate } = require('../services/templates')

    const fixMap = {
      'no-branch-protection': async () => gh.setBranchProtection(owner, repoName),
      'no-cicd': async () => {
        const templateKey = repo.stack?.toLowerCase().includes('python') ? 'python' : 
                            repo.stack?.toLowerCase().includes('go') ? 'go' : 'node'
        const yaml = getTemplate(templateKey)
        await gh.createOrUpdateFile(owner, repoName, '.github/workflows/ci.yml', yaml, 'ci: add workflow via RepoForge')
      },
      'no-readme': async () => {
        const { generateReadme } = require('../services/ai')
        const content = await generateReadme(repoName, repo.stack || 'generic', [])
        await gh.createOrUpdateFile(owner, repoName, 'README.md', content, 'docs: generate README via RepoForge')
      },
      'no-security': async () => {
        const content = getTemplate('security').replace(/{{REPO_NAME}}/g, repoName)
        await gh.createOrUpdateFile(owner, repoName, 'SECURITY.md', content, 'docs: add SECURITY.md via RepoForge')
      },
      'no-contributing': async () => {
        const content = getTemplate('contributing').replace(/{{REPO_NAME}}/g, repoName)
        await gh.createOrUpdateFile(owner, repoName, 'CONTRIBUTING.md', content, 'docs: add CONTRIBUTING.md via RepoForge')
      },
    }

    const fixFn = fixMap[checkId]
    if (!fixFn) return res.status(400).json({ error: `Automation not available for check: ${checkId}` })

    await fixFn()

    // Re-audit after the fix is applied
    const result = await runAudit(
      { name: repo.name, fullName: repo.full_name, stack: repo.stack, owner, repo: repoName },
      gh
    )

    await db.auditRuns.create({
      repoId, 
      userId: req.user.userId,
      score: result.score, 
      issues: result.issues, 
      passedChecks: result.passedChecks,
      summary: result.summary
    })

    await db.repos.updateScore(repoId, result.score)

    res.json({ success: true, newScore: result.score, result })
  } catch (err) {
    console.error('Audit Fix Error:', err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
