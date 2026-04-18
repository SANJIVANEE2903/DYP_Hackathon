export type Stack = 'Node.js' | 'Python' | 'Go' | 'Java' | 'React Native' | 'Rust';

export interface Repository {
  id: string;
  name: string;
  org: string;
  stack: Stack;
  score: number;
  isPrivate: boolean;
  updatedAt: string;
}

export interface AuditIssue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  fixable: boolean;
}

export interface AuditResult {
  repoId: string;
  repoName: string;
  score: number;
  totalChecks: number;
  criticalIssues: AuditIssue[];
  warnings: AuditIssue[];
  passed: AuditIssue[];
}

export interface Preset {
  id: string;
  name: string;
  appliedRepos: number;
  lastModified: string;
  settings: PresetSettings;
}

export interface PresetSettings {
  requireBranchProtection: boolean;
  createCIDPipeline: boolean;
  addIssueTemplates: boolean;
  enforceCodeReview: boolean;
  addSecurityMD: boolean;
  addContributingMD: boolean;
  setUpEnvironments: boolean;
  stacks: Stack[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'Free' | 'Pro' | 'Team';
  avatar?: string;
}
