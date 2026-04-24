const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../db/database');

/**
 * POST /api/tokens/github
 * Save a GitHub Personal Access Token for the user
 */
router.post('/github', requireAuth, async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Basic validation: ghp_ or github_pat_
    if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
      return res.status(400).json({ error: 'Invalid GitHub token format' });
    }

    await db.users.updateGithubToken(req.user.userId, token);
    
    res.json({ success: true, message: 'GitHub token saved successfully' });
  } catch (err) {
    console.error('POST /api/tokens/github error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/tokens/status
 * Check if the user has a GitHub token configured
 */
router.get('/status', requireAuth, async (req, res) => {
  try {
    const user = await db.users.findById(req.user.userId);
    res.json({
      hasToken: !!user.github_token,
      githubConnected: !!user.github_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
