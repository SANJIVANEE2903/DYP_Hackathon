require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { requireAuth } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const repoRoutes = require('./routes/repos');
const auditRoutes = require('./routes/audit');
const presetRoutes = require('./routes/presets');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-GitHub-Token']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/presets', presetRoutes);

// Dashboard Stats
app.get('/api/dashboard/stats', requireAuth, async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

    // Fetch user-specific stats
    const [reposResult, presetsResult] = await Promise.all([
      supabase.from('repos').select('health_score').eq('owner_id', req.user.userId),
      supabase.from('presets').select('id').eq('user_id', req.user.userId)
    ])

    if (reposResult.error) throw reposResult.error;
    if (presetsResult.error) throw presetsResult.error;

    const repos = reposResult.data || []
    const scores = repos.map(r => r.health_score).filter(s => s !== null && s !== undefined)
    const avgScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0

    res.json({
      totalRepos: repos.length,
      avgScore,
      reposNeedingAttention: repos.filter(r => (r.health_score || 0) < 60).length,
      totalIssuesFound: 0, // This would ideally be an aggregation of outstanding audit issues
      presets: (presetsResult.data || []).length
    })
  } catch (err) {
    console.error('Stats error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`RepoForge Backend listening on port ${PORT}`);
  });
}

module.exports = app;
