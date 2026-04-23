const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jose = require('jose');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-development-only-change-in-production'
);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// State management for CSRF protection (10 minute TTL)
const authStates = new Map();

/**
 * GET /api/auth/github
 * Initiates the GitHub OAuth handshake
 */
router.get('/github', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  
  // Store state with 10 minute expiry
  authStates.set(state, true);
  setTimeout(() => authStates.delete(state), 10 * 60 * 1000);

  const scope = 'repo,read:org,workflow,admin:repo_hook';
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${scope}&state=${state}`;
  
  res.redirect(githubUrl);
});

/**
 * GET /api/auth/callback
 * Handles GitHub OAuth callback, exchanges code for token, and creates user session
 */
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // 1. Verify CSRF state
  if (!state || !authStates.has(state)) {
    return res.status(400).json({ error: 'Invalid state (CSRF Protection)' });
  }
  authStates.delete(state);

  try {
    // 2. Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('Failed to obtain access token from GitHub');
    }

    // 3. Fetch GitHub user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'RepoForge-Backend',
      },
    });

    const userData = await userResponse.json();

    // 4. Upsert user in the database
    const user = db.users.upsert({
      githubId: userData.id,
      login: userData.login,
      name: userData.name,
      avatarUrl: userData.avatar_url,
      email: userData.email,
      accessToken: accessToken,
    });

    // 5. Create JWT
    const jwt = await new jose.SignJWT({
      userId: user.id,
      githubLogin: user.login,
      plan: user.plan,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // 6. Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/dashboard?token=${jwt}`);
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
});

/**
 * GET /api/auth/me
 * Returns the currently authenticated user
 */
router.get('/me', requireAuth, (req, res) => {
  const user = db.users.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Remove sensitive token before sending
  const { access_token, ...safeUser } = user;
  res.json(safeUser);
});

/**
 * POST /api/auth/logout
 * Stateless logout (client handles token deletion)
 */
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

module.exports = router;
