const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../db/database');

/**
 * GET /api/history
 * Fetch all audit history for the current user
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const history = await db.auditRuns.findAllByUserId(req.user.userId);
    res.json(history);
  } catch (err) {
    console.error('GET /api/history error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/history/repo/:repoId
 * Fetch audit history for a specific repo
 */
router.get('/repo/:repoId', requireAuth, async (req, res) => {
  try {
    const history = await db.auditRuns.findByRepoId(req.params.repoId);
    res.json(history);
  } catch (err) {
    console.error('GET /api/history/repo error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
