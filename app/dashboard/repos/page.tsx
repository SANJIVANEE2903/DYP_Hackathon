'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { RepoCard } from '@/components/repos/repo-card';
import { MOCK_REPOS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RepositoriesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filteredRepos = MOCK_REPOS.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(search.toLowerCase()) || 
                          repo.org.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || repo.stack === filter;
    return matchesSearch && matchesFilter;
  });

  const stacks = ['all', ...Array.from(new Set(MOCK_REPOS.map(r => r.stack)))];

  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-[#e5e7eb] px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0a0a0a]">Repositories</h1>
            <p className="text-sm text-[#6b7280] mt-0.5">Manage and monitor health across your organization.</p>
          </div>
          <Button>
            Connect repo
          </Button>
        </div>

        <div className="p-8">
          {/* Search and filter */}
          <div className="flex gap-3 mb-8 flex-col sm:flex-row">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <Input
                placeholder="Search repositories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-10 px-3 pr-8 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0070f3] bg-white transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
              >
                {stacks.map((stack) => (
                  <option key={stack} value={stack}>
                    {stack === 'all' ? 'All stacks' : stack}
                  </option>
                ))}
              </select>
              <Button variant="secondary" onClick={() => { setSearch(''); setFilter('all'); }}>
                Clear
              </Button>
            </div>
          </div>

          {/* Repos grid */}
          {filteredRepos.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-16 text-center max-w-lg mx-auto mt-8">
              <div className="w-16 h-16 bg-[#f3f4f6] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">No repositories connected yet</h3>
              <p className="text-[#6b7280] mb-8 leading-relaxed">Connect your first GitHub repository to get started with RepoForge configuration and health monitoring.</p>
              <Button className="px-8 h-11">
                Connect repository
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
