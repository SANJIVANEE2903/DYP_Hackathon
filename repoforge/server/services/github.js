/**
 * Custom error for GitHub API Rate Limit exhaustion
 */
class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * GitHub API Service for RepoForge
 */
class GitHubService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://api.github.com';
  }

  /**
   * Internal helper to make GitHub API requests with rate limiting and retries
   * @param {string} endpoint - API endpoint (e.g., /user/repos)
   * @param {object} options - Fetch options
   * @param {number} retryAttempt - Internal retry counter
   * @returns {Promise<any>}
   */
  async _request(endpoint, options = {}, retryAttempt = 0) {
    // 1. Check Rate Limit before request
    if (endpoint !== '/rate_limit') {
      const rateLimit = await this._getRateLimit();
      if (rateLimit && rateLimit.remaining < 10) {
        throw new RateLimitError('GitHub API Rate Limit nearly exhausted (remaining < 10)');
      }
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const defaultHeaders = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'RepoForge-Backend',
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers: defaultHeaders });

      // Handle 404 gracefully as requested
      if (response.status === 404) {
        return null;
      }

      // Handle other errors with exponential backoff
      if (!response.ok) {
        if (retryAttempt < 3 && response.status >= 500) {
          const delay = Math.pow(2, retryAttempt) * 1000; // 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, delay));
          return this._request(endpoint, options, retryAttempt + 1);
        }

        // Special handling for label creation (422) in createLabels method
        if (response.status === 422 && options.method === 'POST' && endpoint.endsWith('/labels')) {
          return { already_exists: true };
        }

        const errorText = await response.text();
        throw new Error(`GitHub API Error (${response.status}): ${errorText}`);
      }

      // Return JSON for all but empty responses
      if (response.status === 204) return true;
      return await response.json();
    } catch (error) {
      if (retryAttempt < 3) {
        const delay = Math.pow(2, retryAttempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this._request(endpoint, options, retryAttempt + 1);
      }
      throw error;
    }
  }

  async _getRateLimit() {
    try {
      // Direct fetch to avoid recursion in _request
      const res = await fetch(`${this.baseUrl}/rate_limit`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'User-Agent': 'RepoForge-Backend',
        }
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.resources.core;
    } catch (e) {
      return null;
    }
  }

  /**
   * List repositories the user has access to
   */
  async listUserRepos() {
    const repos = await this._request('/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator');
    if (!repos) return [];
    
    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      isPrivate: repo.private,
      defaultBranch: repo.default_branch,
      description: repo.description
    }));
  }

  /**
   * Get specific repository details
   */
  async getRepoDetails(owner, repo) {
    return await this._request(`/repos/${owner}/${repo}`);
  }

  /**
   * Create a new repository
   */
  async createRepo(owner, repoName, isOrg = false) {
    const endpoint = isOrg ? `/orgs/${owner}/repos` : `/user/repos`;
    return await this._request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: repoName,
        private: true,
        auto_init: true
      })
    });
  }

  /**
   * List files in the root directory
   */
  async listRootFiles(owner, repo) {
    const contents = await this._request(`/repos/${owner}/${repo}/contents/`);
    if (!contents || !Array.isArray(contents)) return [];
    return contents.filter(item => item.type === 'file').map(item => item.name);
  }

  /**
   * Fetch file content and decode from Base64
   */
  async getFileContent(owner, repo, path) {
    const data = await this._request(`/repos/${owner}/${repo}/contents/${path}`);
    if (!data || !data.content) return null;
    return Buffer.from(data.content, 'base64').toString('utf8');
  }

  /**
   * List workflows in the repository
   */
  async listWorkflows(owner, repo) {
    const data = await this._request(`/repos/${owner}/${repo}/actions/workflows`);
    if (!data || !data.workflows) return [];
    return data.workflows.map(w => w.name);
  }

  /**
   * Get branch protection settings
   */
  async getBranchProtection(owner, repo, branch = 'main') {
    return await this._request(`/repos/${owner}/${repo}/branches/${branch}/protection`);
  }

  /**
   * Set rigorous branch protection rules
   */
  async setBranchProtection(owner, repo, branch = 'main') {
    return await this._request(`/repos/${owner}/${repo}/branches/${branch}/protection`, {
      method: 'PUT',
      headers: { 'Accept': 'application/vnd.github.luke-cage-preview+json' },
      body: JSON.stringify({
        required_status_checks: { strict: true, contexts: ['ci'] },
        enforce_admins: false,
        required_pull_request_reviews: {
          required_approving_review_count: 1,
          dismiss_stale_reviews: true
        },
        restrictions: null,
        allow_force_pushes: false,
        allow_deletions: false
      })
    });
  }

  /**
   * Create or update a file (automatically handles Base64 encoding and SHA retrieval)
   */
  async createOrUpdateFile(owner, repo, path, content, message) {
    // 1. Check if file exists to get SHA
    const existing = await this._request(`/repos/${owner}/${repo}/contents/${path}`);
    const sha = existing ? existing.sha : undefined;

    return await this._request(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString('base64'),
        sha
      })
    });
  }

  /**
   * Create missing labels in the repository
   */
  async createLabels(owner, repo, labels) {
    const results = [];
    for (const label of labels) {
      const res = await this._request(`/repos/${owner}/${repo}/labels`, {
        method: 'POST',
        body: JSON.stringify(label)
      });
      results.push(res);
    }
    return results;
  }

  /**
   * Create a deployment environment
   */
  async createEnvironment(owner, repo, environmentName) {
    return await this._request(`/repos/${owner}/${repo}/environments/${environmentName}`, {
      method: 'PUT'
    });
  }

  /**
   * Create a webhook for events
   */
  async createWebhook(owner, repo, webhookUrl, secret) {
    return await this._request(`/repos/${owner}/${repo}/hooks`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'web',
        active: true,
        events: ['push', 'pull_request', 'workflow_run'],
        config: {
          url: webhookUrl,
          content_type: 'json',
          secret: secret,
          insecure_ssl: '0'
        }
      })
    });
  }
}

/**
 * Factory function to get a new instance of GitHubService
 */
function getGitHubService(accessToken) {
  return new GitHubService(accessToken);
}

module.exports = {
  GitHubService,
  RateLimitError,
  getGitHubService
};
