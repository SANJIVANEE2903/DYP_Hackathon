'use client';

import { useState } from 'react';
import Link from 'next/link';

const STACKS = ['Node.js', 'Python', 'Go', 'Java', 'React Native', 'Rust'] as const;
const PRESETS = [
  { id: 'minimal', name: 'Minimal', description: 'Basic rules with essential protections only', features: ['Branch protection', 'License file'] },
  { id: 'standard', name: 'Standard', description: 'Recommended for most teams and open-source projects', features: ['Branch protection', 'CI/CD workflows', 'Issue templates', 'Code review required'] },
  { id: 'enterprise', name: 'Enterprise', description: 'Full compliance, security, and audit-ready setup', features: ['Everything in Standard', 'SECURITY.md', 'CONTRIBUTING.md', 'Environments (prod/staging)', 'SSO-compatible'] },
];

const STACK_ICONS: Record<string, string> = {
  'Node.js': '🟩',
  'Python': '🐍',
  'Go': '🔵',
  'Java': '☕',
  'React Native': '⚛️',
  'Rust': '🦀',
};

// CSS-only confetti particles
function Confetti() {
  const colors = ['#0070f3', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
  const particles = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.6}s`,
    duration: `${0.8 + Math.random() * 0.8}s`,
    size: `${6 + Math.random() * 8}px`,
    shape: i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rounded-sm rotate-45' : 'rounded-none',
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(300px) rotate(720deg); opacity: 0; }
        }
        .confetti-piece { animation: confettiFall var(--dur) var(--delay) ease-in forwards; }
      `}</style>
      {particles.map(p => (
        <div
          key={p.id}
          className={`absolute confetti-piece ${p.shape}`}
          style={{
            left: p.left,
            top: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            '--dur': p.duration,
            '--delay': p.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [repoName, setRepoName] = useState('');

  const handleStackToggle = (stack: string) => {
    setSelectedStacks(prev =>
      prev.includes(stack) ? prev.filter(s => s !== stack) : [...prev, stack]
    );
  };

  const canProceed = () => {
    if (step === 2) return selectedStacks.length > 0;
    if (step === 3) return selectedPreset !== '';
    if (step === 4) return repoName.trim() !== '';
    return true;
  };

  const stepLabels = ['Connect GitHub', 'Choose stack', 'Pick a preset', 'Create repo', 'Done'];

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-[#e5e7eb] px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[#0a0a0a] text-sm">
          <div className="w-6 h-6 bg-[#0070f3] rounded grid grid-cols-2 gap-px p-1 shrink-0">
            <div className="bg-white rounded-[1px]" />
            <div className="bg-white rounded-[1px]" />
            <div className="bg-white rounded-[1px]" />
            <div className="bg-white rounded-[1px]" />
          </div>
          RepoForge
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10">
        {/* Step progress pills */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-1">
          {stepLabels.map((label, i) => {
            const s = i + 1;
            const isActive = s === step;
            const isDone = s < step;
            return (
              <div key={s} className="flex items-center gap-2 shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  isActive ? 'bg-[#0070f3] text-white'
                  : isDone ? 'bg-[#dcfce7] text-[#166534]'
                  : 'bg-[#f3f4f6] text-[#9ca3af]'
                }`}>
                  {isDone ? (
                    <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-[10px]">{s}</span>
                  )}
                  {label}
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`w-4 h-px ${isDone ? 'bg-[#10b981]' : 'bg-[#e5e7eb]'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Step 1: Connect GitHub ── */}
        {step === 1 && (
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 text-center">
            <div className="w-14 h-14 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-[#0a0a0a]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.19.092-.926.35-1.546.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817a9.56 9.56 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.193 20 14.441 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-[#0a0a0a] mb-2">Connect your GitHub account</h1>
            <p className="text-[#6b7280] mb-8 text-sm">We need read/write access to configure your repositories</p>
            <button
              onClick={() => setStep(2)}
              className="w-full px-6 py-3 bg-[#0a0a0a] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors font-medium inline-flex items-center justify-center gap-2.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.19.092-.926.35-1.546.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817a9.56 9.56 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.193 20 14.441 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Continue with GitHub
            </button>
            <p className="text-xs text-[#9ca3af] mt-3">
              We only access repositories you explicitly grant
            </p>
          </div>
        )}

        {/* ── Step 2: Choose stack ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-semibold text-[#0a0a0a]">What&apos;s your primary tech stack?</h1>
              <p className="text-sm text-[#6b7280] mt-1">Select all that apply — we&apos;ll tailor the setup for you</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STACKS.map(stack => {
                const selected = selectedStacks.includes(stack);
                return (
                  <button
                    key={stack}
                    onClick={() => handleStackToggle(stack)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? 'border-[#0070f3] bg-[#eff6ff]'
                        : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db]'
                    }`}
                  >
                    <div className="text-2xl mb-2">{STACK_ICONS[stack]}</div>
                    <div className="text-sm font-medium text-[#0a0a0a]">{stack}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 3: Pick preset ── */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-semibold text-[#0a0a0a]">Choose a setup preset</h1>
              <p className="text-sm text-[#6b7280] mt-1">You can customize this later in Org Presets</p>
            </div>
            <div className="space-y-3">
              {PRESETS.map(preset => {
                const selected = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                      selected ? 'border-[#0070f3] bg-[#eff6ff]' : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-[#0a0a0a]">{preset.name}</h3>
                      {selected && (
                        <svg className="w-4 h-4 text-[#0070f3]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-[#6b7280] mb-3">{preset.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {preset.features.map(f => (
                        <span key={f} className="text-[11px] px-2 py-0.5 bg-[#f3f4f6] text-[#374151] rounded-full">{f}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 4: Create repo ── */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-semibold text-[#0a0a0a]">Create your first repository</h1>
              <p className="text-sm text-[#6b7280] mt-1">RepoForge will configure it automatically with your preset</p>
            </div>
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
              <label className="block text-sm font-medium text-[#0a0a0a] mb-1.5">Repository name</label>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-[#6b7280] shrink-0">acmecorp /</span>
                <input
                  type="text"
                  value={repoName}
                  onChange={e => setRepoName(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                  placeholder="my-awesome-project"
                  className="flex-1 px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0070f3] focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                {[
                  `Stack: ${selectedStacks.join(', ') || 'Auto-detected'}`,
                  `Preset: ${PRESETS.find(p => p.id === selectedPreset)?.name ?? '—'}`,
                  'Visibility: Private',
                ].map(line => (
                  <div key={line} className="flex items-center gap-2 text-xs text-[#6b7280]">
                    <svg className="w-3.5 h-3.5 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 5: Done ── */}
        {step === 5 && (
          <div className="relative bg-white border border-[#e5e7eb] rounded-xl p-8 text-center overflow-hidden">
            <Confetti />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-[#0a0a0a] mb-2">You&apos;re all set!</h1>
              <p className="text-[#6b7280] mb-2 text-sm">
                <strong className="text-[#0a0a0a]">acmecorp/{repoName || 'my-project'}</strong> is configured and ready.
              </p>
              <p className="text-xs text-[#9ca3af] mb-6">
                CI/CD workflows, branch protection, and templates are all enabled.
              </p>
              <a
                href={`https://github.com/acmecorp/${repoName || 'my-project'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#0070f3] hover:text-[#0060df] inline-flex items-center gap-1 mb-6"
              >
                github.com/acmecorp/{repoName || 'my-project'} ↗
              </a>
              <div className="pt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-[#0070f3] text-white hover:bg-[#0060df] rounded-lg px-6 py-3 font-medium transition-colors"
                >
                  Go to dashboard →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step < 5 && (
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-4 py-2.5 border border-[#e5e7eb] text-[#374151] rounded-lg hover:bg-[#f9fafb] transition-colors font-medium text-sm"
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1 px-4 py-2.5 bg-[#0070f3] text-white rounded-lg hover:bg-[#0060df] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {step === 4 ? 'Initialize →' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
