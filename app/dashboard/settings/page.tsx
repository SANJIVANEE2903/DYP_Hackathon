'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-[#e5e7eb] px-8 py-6">
          <h1 className="text-2xl font-semibold text-[#0a0a0a]">Settings</h1>
          <p className="text-sm text-[#6b7280] mt-1">Manage your account and workspace preferences</p>
        </div>

        <div className="p-8 max-w-2xl space-y-6">
          {/* Profile */}
          <Card className="p-6">
            <h2 className="text-base font-semibold text-[#0a0a0a] mb-5">Profile</h2>
            <div className="flex items-center gap-5 mb-8 p-4 bg-[#fafafa] rounded-xl border border-[#f3f4f6]">
              <div className="w-16 h-16 rounded-full bg-[#0070f3] flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                A
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#0a0a0a]">Arjun Sharma</p>
                <p className="text-sm text-[#6b7280]">arjun@acmecorp.com</p>
              </div>
              <Button variant="secondary" className="h-9">
                Change photo
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Display name</label>
                <Input defaultValue="Arjun Sharma" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Email</label>
                <Input defaultValue="arjun@acmecorp.com" type="email" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button>Save changes</Button>
            </div>
          </Card>

          {/* GitHub connection */}
          <Card className="p-6">
            <h2 className="text-base font-semibold text-[#0a0a0a] mb-1">GitHub Connection</h2>
            <p className="text-sm text-[#6b7280] mb-5">Manage your GitHub OAuth integration and access permissions.</p>
            <div className="flex items-center justify-between p-4 bg-[#fafafa] rounded-xl border border-[#e5e7eb]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white border border-[#e5e7eb] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#0a0a0a]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.19.092-.926.35-1.546.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817a9.56 9.56 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.193 20 14.441 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0a0a0a]">github.com/arjun-sharma</p>
                  <p className="text-xs text-[#6b7280]">Connected · 12 repositories accessible</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="success" className="h-6 font-medium">Connected</Badge>
                <Button variant="ghost" className="h-9 text-[#ef4444] hover:text-[#dc2626] hover:bg-[#fee2e2]">
                  Disconnect
                </Button>
              </div>
            </div>
          </Card>

          {/* Plan & Billing */}
          <Card className="p-6">
            <h2 className="text-base font-semibold text-[#0a0a0a] mb-1">Plan & Billing</h2>
            <p className="text-sm text-[#6b7280] mb-5">Your current subscription and usage statistics.</p>
            <div className="flex items-center justify-between p-5 bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-[#1e40af]">Pro Plan</p>
                  <Badge variant="info" className="bg-[#0070f3] text-white border-none py-0">Active</Badge>
                </div>
                <p className="text-sm text-[#1e40af]/80">$12/month · Renews May 17, 2026</p>
              </div>
              <Button className="bg-white text-[#0070f3] hover:bg-white/90 border-none">
                Manage plan
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Repositories', used: 4, total: '∞' },
                { label: 'Monthly audits', used: 23, total: '∞' },
                { label: 'Team members', used: 1, total: '5' },
              ].map(stat => (
                <div key={stat.label} className="p-4 bg-[#fafafa] rounded-xl border border-[#e5e7eb] text-center">
                  <p className="text-xl font-bold text-[#0a0a0a] leading-none mb-1">{stat.used}</p>
                  <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">{stat.label}</p>
                  <p className="text-[10px] text-[#9ca3af] mt-1">of {stat.total}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Danger zone */}
          <Card className="p-6 border-[#fecaca]">
            <h2 className="text-base font-semibold text-[#b91c1c] mb-1">Danger Zone</h2>
            <p className="text-sm text-[#6b7280] mb-5">Irreversible actions that affect your data and account access.</p>
            <div className="flex items-center justify-between p-4 border border-[#fecaca] rounded-xl bg-[#fffafb]">
              <div>
                <p className="text-sm font-semibold text-[#991b1b]">Delete account</p>
                <p className="text-xs text-[#991b1b]/70 mt-0.5">Permanently removes your account and all audit data.</p>
              </div>
              <Button variant="ghost" className="bg-white text-[#ef4444] border border-[#fecaca] hover:bg-[#fee2e2]">
                Delete account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
