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

// State management for CSRF and account linking (10 minute TTL)
const authStates = new Map();

/**
 * GET /api/auth/github
 * Initiates the GitHub OAuth handshake
 * Can accept ?userId=... to link to an existing email account
 */
router.get('/github', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const userId = req.query.userId;
  
  // Store state and optional userId for linking
  authStates.set(state, { userId, timestamp: Date.now() });
  setTimeout(() => authStates.delete(state), 10 * 60 * 1000);

  const scope = 'repo,read:org,workflow,admin:repo_hook';
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${scope}&state=${state}`;
  
  res.redirect(githubUrl);
});

/**
 * GET /api/auth/callback
 * Handles GitHub OAuth callback
 */
router.get('/callback', async (req, res) => {
  const { code, state: stateKey } = req.query;

  // 1. Verify state
  console.log('GitHub Callback Received:', { stateKey, code: code ? 'PRESENT' : 'MISSING' });
  const stateData = authStates.get(stateKey);
  
  if (!stateKey || !stateData) {
    console.warn('OAuth State Mismatch or Expired:', { received: stateKey, available: Array.from(authStates.keys()) });
    return res.status(400).json({ error: 'Invalid or expired state' });
  }
  authStates.delete(stateKey);
  console.log('State Verified for user:', stateData.userId || 'NEW_USER');

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

    // 4. Upsert user - Link to existing userId if provided
    const user = await db.users.upsert({
      id: stateData.userId, // If present, we link/update this user
      githubId: userData.id,
      login: userData.login,
      name: userData.name,
      avatarUrl: userData.avatar_url,
      email: userData.email,
      accessToken: accessToken,
      github_connected: true
    });

    // 5. Create JWT (Note: We use our own JWT for API calls, 
    // but the client will also have the Supabase session)
    const jwt = await new jose.SignJWT({
      userId: user.id,
      githubLogin: user.login,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // 6. Redirect to frontend
    res.redirect(`${FRONTEND_URL}/dashboard?token=${jwt}`);
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
});

/**
 * GET /api/auth/me
 * Returns the currently authenticated user from our database
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    // requireAuth already verified the Supabase token and set req.user.userId
    const user = await db.users.findById(req.user.userId);
    
    if (!user) {
      // If user exists in Supabase but not in our table yet, create them
      // This happens right after Email Signup but before GitHub Connect
      const newUser = await db.users.upsert({
        id: req.user.userId,
        email: req.user.email,
        github_connected: false
      });
      return res.json(newUser);
    }

    // Hide sensitive fields
    const { access_token, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
