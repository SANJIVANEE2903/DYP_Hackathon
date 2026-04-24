require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { requireAuth } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const repoRoutes = require('./routes/repos');
const auditRoutes = require('./routes/audit');
const presetRoutes = require('./routes/presets');
const historyRoutes = require('./routes/history');
const tokenRoutes = require('./routes/tokens');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for local development to avoid blocking localhost:3001
}));
app.use(cors({
  origin: true, // Allow any origin in development
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-GitHub-Token']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/presets', presetRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/tokens', tokenRoutes);

// Dashboard Stats
app.get('/api/dashboard/stats', requireAuth, async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

    // Fetch user-specific stats
    const [reposResult, presetsResult] = await Promise.all([
      supabase.from('repos').select('health_score').eq('owner_id', req.user.userId),
      supabase.from('presets').select('id').eq('owner_id', req.user.userId)
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
      activeCIRuns: 0, // Hardcoded for now
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
  const server = app.listen(PORT, () => {
    console.log(`RepoForge Backend listening on port ${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\x1b[31m[Error]\x1b[0m Port ${PORT} is already in use.`);
      console.error(`\x1b[33m[Fix]\x1b[0m Run this command to kill the process:`);
      console.error(`\x1b[36mStop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\x1b[0m`);
      process.exit(1);
    } else {
      console.error('Server error:', error);
    }
  });
}

module.exports = app;
