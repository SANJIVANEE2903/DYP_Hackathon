import { createClient } from './client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Helper to fetch with Supabase JWT token
 */
async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const githubToken = typeof window !== 'undefined' ? localStorage.getItem('github_access_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(githubToken ? { 'X-GitHub-Token': githubToken } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(error.message || error.error || `HTTP Error: ${response.status}`);
  }

  return response.json();
}

// Exported standalone functions as requested
export async function getRepos() {
  return fetchWithAuth('/api/repos');
}

export async function connectRepo(fullName: string) {
  return fetchWithAuth('/api/repos/connect', {
    method: 'POST',
    body: JSON.stringify({ repoFullName: fullName }),
  });
}

export async function runAudit(repoId: string | number) {
  return fetchWithAuth('/api/audit/run', {
    method: 'POST',
    body: JSON.stringify({ repoId }),
  });
}

export async function getAuditResult(repoId: string | number) {
  return fetchWithAuth(`/api/audit/${repoId}`);
}

export async function getPresets() {
  return fetchWithAuth('/api/presets');
}

export async function createPreset(data: any) {
  return fetchWithAuth('/api/presets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function applyPreset(id: string | number, repoIds: (string | number)[]) {
  return fetchWithAuth(`/api/presets/${id}/apply`, {
    method: 'POST',
    body: JSON.stringify({ repoIds }),
  });
}

export async function getDashboardStats() {
  return fetchWithAuth('/api/dashboard/stats');
}

/**
 * Legacy support for components while migrating
 * @deprecated Use standalone functions instead
 */
export const api = {
  repositories: {
    getAll: getRepos,
    getById: (id: string) => fetchWithAuth(`/api/repos/${id}`),
    create: (data: any) => connectRepo(`${data.org}/${data.name}`),
  },
  auditRuns: {
    getByRepo: getAuditResult,
  },
  presets: {
    getAll: getPresets,
  }
};
