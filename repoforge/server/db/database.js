const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

/**
 * Simple ID generator (cuid-style)
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Database initialization
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'repoforge.db');

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL'); // Better performance for SQLite

// Table initialization SQL
const schema = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  github_id INTEGER UNIQUE NOT NULL,
  login TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  email TEXT,
  plan TEXT DEFAULT 'free',
  access_token TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS repos (
  id TEXT PRIMARY KEY,
  github_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  is_private INTEGER DEFAULT 0,
  stack TEXT,
  health_score INTEGER,
  owner_id TEXT NOT NULL,
  last_audit_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_runs (
  id TEXT PRIMARY KEY,
  repo_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  issues TEXT NOT NULL,
  passed_checks TEXT NOT NULL,
  summary TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repo_id) REFERENCES repos(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS presets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  org_name TEXT,
  owner_id TEXT NOT NULL,
  config TEXT NOT NULL,
  applied_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
`;

sqlite.exec(schema);

/**
 * DB object containing all methods
 */
const db = {
  users: {
    findById: (id) => {
      return sqlite.prepare('SELECT * FROM users WHERE id = ?').get(id);
    },
    findByGithubId: (githubId) => {
      return sqlite.prepare('SELECT * FROM users WHERE github_id = ?').get(githubId);
    },
    upsert: (userData) => {
      const { githubId, login, name, avatarUrl, email, accessToken } = userData;
      
      // Try to find existing user to keep the same ID
      const existing = sqlite.prepare('SELECT id FROM users WHERE github_id = ?').get(githubId);
      const id = existing ? existing.id : generateId();

      sqlite.prepare(`
        INSERT OR REPLACE INTO users (id, github_id, login, name, avatar_url, email, access_token)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, githubId, login, name, avatarUrl, email, accessToken);

      return db.users.findById(id);
    }
  },

  repos: {
    findByOwnerId: (ownerId) => {
      return sqlite.prepare('SELECT * FROM repos WHERE owner_id = ? ORDER BY last_audit_at DESC').all(ownerId);
    },
    findById: (id) => {
      return sqlite.prepare('SELECT * FROM repos WHERE id = ?').get(id);
    },
    findByFullName: (fullName) => {
      return sqlite.prepare('SELECT * FROM repos WHERE full_name = ?').get(fullName);
    },
    upsert: (repoData) => {
      const { github_id, name, full_name, is_private, stack, health_score, owner_id } = repoData;
      
      // Try to find existing repo to keep the same ID
      const existing = sqlite.prepare('SELECT id FROM repos WHERE github_id = ?').get(github_id);
      const id = existing ? existing.id : generateId();

      sqlite.prepare(`
        INSERT OR REPLACE INTO repos (id, github_id, name, full_name, is_private, stack, health_score, owner_id, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(id, github_id, name, full_name, is_private ? 1 : 0, stack, health_score, owner_id);

      return db.repos.findById(id);
    },
    updateScore: (id, score) => {
      return sqlite.prepare(`
        UPDATE repos 
        SET health_score = ?, last_audit_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(score, id);
    }
  },

  auditRuns: {
    create: (data) => {
      const id = generateId();
      const { repoId, userId, score, issues, passedChecks, summary } = data;
      
      sqlite.prepare(`
        INSERT INTO audit_runs (id, repo_id, user_id, score, issues, passed_checks, summary)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, 
        repoId, 
        userId, 
        score, 
        JSON.stringify(issues || []), 
        JSON.stringify(passedChecks || []), 
        summary
      );

      return db.auditRuns.findLatestByRepoId(repoId);
    },
    findLatestByRepoId: (repoId) => {
      const run = sqlite.prepare('SELECT * FROM audit_runs WHERE repo_id = ? ORDER BY created_at DESC LIMIT 1').get(repoId);
      if (run) {
        run.issues = JSON.parse(run.issues);
        run.passed_checks = JSON.parse(run.passed_checks);
      }
      return run;
    },
    findByRepoId: (repoId, limit = 10) => {
      const runs = sqlite.prepare('SELECT * FROM audit_runs WHERE repo_id = ? ORDER BY created_at DESC LIMIT ?').all(repoId, limit);
      return runs.map(run => {
        run.issues = JSON.parse(run.issues);
        run.passed_checks = JSON.parse(run.passed_checks);
        return run;
      });
    }
  },

  presets: {
    findByOwnerId: (ownerId) => {
      return sqlite.prepare('SELECT * FROM presets WHERE owner_id = ? ORDER BY created_at DESC').all(ownerId);
    },
    findById: (id) => {
      return sqlite.prepare('SELECT * FROM presets WHERE id = ?').get(id);
    },
    create: (data) => {
      const id = generateId();
      const { name, orgName, ownerId, config } = data;
      
      sqlite.prepare(`
        INSERT INTO presets (id, name, org_name, owner_id, config)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, name, orgName, ownerId, typeof config === 'string' ? config : JSON.stringify(config));

      return db.presets.findById(id);
    },
    update: (id, data) => {
      const { name, config } = data;
      return sqlite.prepare(`
        UPDATE presets 
        SET name = ?, config = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(name, typeof config === 'string' ? config : JSON.stringify(config), id);
    },
    delete: (id) => {
      return sqlite.prepare('DELETE FROM presets WHERE id = ?').run(id);
    },
    incrementApplied: (id) => {
      return sqlite.prepare('UPDATE presets SET applied_count = applied_count + 1 WHERE id = ?').run(id);
    }
  }
};

module.exports = db;
