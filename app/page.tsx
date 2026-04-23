'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HOW_IT_WORKS = [
  {
    number: '1',
    title: 'Install once',
    command: 'npm install -g repoforge',
    description: 'Get the CLI tool installed globally and authenticate with GitHub in seconds.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="#0070f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    number: '2',
    title: 'Run in any project',
    command: 'repoforge init',
    description: 'Execute from your project root. Our AI detects your stack and suggests the best config.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="#0070f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    number: '3',
    title: 'GitHub configured',
    command: 'CI/CD · rules · templates',
    description: 'Your repo is fully set up with branch protection, actions, and standards.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="#0070f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: 'AI Stack Detection',
    description: 'Automated analysis of your codebase to identify frameworks, languages, and dependencies.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="#0070f3" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
      </svg>
    ),
  },
  {
    title: 'CI/CD Pipelines',
    description: 'Bespoke GitHub Actions workflows optimized for your specific tech stack.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="#0070f3" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: 'Branch Protection',
    description: 'Enforce code reviews and status checks to keep your main branch stable.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="#0070f3" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Health Auditor',
    description: 'Real-time monitoring and scoring of your repository configuration health.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="#0070f3" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0115-6.7" />
      </svg>
    ),
  },
  {
    title: 'Org Presets',
    description: 'Set organization-wide standards that are inherited by every new project.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="#0070f3" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    ),
  },
  {
    title: 'Standardization',
    description: 'Shared issue templates, PR guidelines, and CONTRIBUTING files for consistency.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="#0070f3" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff6ff] text-[#0070f3] text-xs font-bold border border-[#dbeafe] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0070f3] animate-pulse" />
              Public Beta Now Live
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-[#0a0a0a] mb-8 leading-[1.05]">
            GitHub repos,<br />
            <span className="text-[#0070f3]">standards automated.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#6b7280] mb-10 leading-relaxed max-w-2xl mx-auto">
            RepoForge eliminates the manual toil of setting up new projects. We detect your stack and automatically configure everything from CI/CD to branch protection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button className="h-12 px-8 text-base shadow-lg shadow-blue-500/20" asChild>
              <Link href="/onboarding">
                Get started for free
              </Link>
            </Button>
            <Button variant="secondary" className="h-12 px-8 text-base" asChild>
              <Link href="/dashboard">
                View dashboard →
              </Link>
            </Button>
          </div>

          <p className="text-xs text-[#9ca3af] font-medium uppercase tracking-widest">
            Free for open source · No credit card required
          </p>
        </div>

        {/* Terminal mockup with better styling */}
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-4 bg-gradient-to-b from-[#0070f3]/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <Card className="p-0 border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden shadow-2xl relative">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a1a] bg-[#0d0d0d]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              </div>
              <span className="ml-4 text-[10px] font-bold text-[#4b5563] uppercase tracking-widest font-mono">repoforge — bash</span>
            </div>
            <div className="p-4 sm:p-8 font-mono text-sm sm:text-base text-left min-h-[250px] sm:min-h-[300px]">
              <div className="mb-6">
                <span className="text-[#4ade80]">~</span> <span className="text-[#a5b4fc]">/dev/my-app</span>
                {' '}$ <span className="text-white animate-pulse">repoforge init</span>
              </div>
              <div className="space-y-2">
                {[
                  { text: 'Analyzing codebase...', delay: '0s' },
                  { text: 'Detected Stack: Next.js (App Router) + TypeScript', delay: '0.4s', highlight: true },
                  { text: 'Configuring GitHub repository...', delay: '0.8s' },
                  { text: 'Pushed GitHub Actions (CI/CD Pipeline)', delay: '1.2s', icon: '✔' },
                  { text: 'Applied Branch Protection (main)', delay: '1.6s', icon: '✔' },
                  { text: 'Created Issue Templates...', delay: '2.0s', icon: '✔' },
                  { text: 'Added SECURITY.md and LICENSE', delay: '2.4s', icon: '✔' },
                ].map((line, i) => (
                  <div key={i} className={`flex items-start gap-3 transition-all duration-500 delay-[${line.delay}]`}>
                    <span className={line.icon ? 'text-[#10b981]' : 'text-[#6b7280]'}>
                      {line.icon || '→'}
                    </span>
                    <span className={line.highlight ? 'text-white font-bold' : 'text-[#9ca3af]'}>
                      {line.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-[#1a1a1a]">
                <span className="text-[#10b981] font-bold">Health Score: 98/100</span>
                <span className="text-[#6b7280] ml-4">Ready for production.</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── LOGO CLOUD ── */}
      <section className="py-20 bg-[#fafafa] border-y border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold text-[#9ca3af] uppercase tracking-[0.2em] mb-12">Empowering teams at world-class companies</p>
          <div className="flex items-center justify-center gap-12 md:gap-20 flex-wrap opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Stripe', 'Vercel', 'Notion', 'Linear', 'GitHub'].map(name => (
              <span key={name} className="text-xl md:text-2xl font-bold text-[#0a0a0a] tracking-tighter">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
        <div className="text-center mb-20">
          <Badge variant="info" className="mb-4">Workflow</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6 tracking-tight">Three steps to consistency.</h2>
          <p className="text-[#6b7280] max-w-lg mx-auto text-lg leading-relaxed">Standardize your engineering culture across every repository in your organization.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step) => (
            <Card key={step.number} className="relative p-8 group hover:border-[#0070f3] transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-[#eff6ff] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                  {step.icon}
                </div>
                <span className="text-5xl font-bold text-[#f3f4f6] group-hover:text-[#eff6ff] transition-colors duration-500">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">{step.title}</h3>
              <div className="bg-[#f9fafb] p-3 rounded-lg border border-[#e5e7eb] mb-4 font-mono text-xs text-[#0070f3]">
                {step.command}
              </div>
              <p className="text-sm text-[#6b7280] leading-relaxed">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="bg-[#0a0a0a] py-16 sm:py-24 md:py-32 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">The developer standard.</h2>
            <p className="text-[#9ca3af] max-w-lg mx-auto text-lg">Every feature built to save your team hours of manual configuration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(feature => (
              <div key={feature.title} className="p-8 rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] hover:bg-[#111] transition-all duration-300 group">
                <div className="mb-6 w-12 h-12 rounded-xl bg-[#0070f3]/10 flex items-center justify-center text-[#0070f3] group-hover:bg-[#0070f3] group-hover:text-white transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-[#9ca3af] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUDIT PREVIEW ── */}
      <section id="audit" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
             <Badge variant="warning" className="mb-4">Health Auditor</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-8 tracking-tight">
              Audit any repository<br/>in one click.
            </h2>
            <p className="text-lg text-[#6b7280] mb-10 leading-relaxed">
              Scan existing repositories to identify missing protection rules, security gaps, and non-standard configurations. Get a prioritized fix list delivered instantly.
            </p>
            <div className="space-y-4 mb-10">
              {[
                'Real-time health scoring',
                'Prioritized critical fix lists',
                'Automated pull request creation',
                'Compliance reporting for teams',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#374151]">{item}</span>
                </div>
              ))}
            </div>
            <Button className="h-11 px-6 shadow-sm shadow-blue-500/10" asChild>
              <Link href="/dashboard/audit">
                Try the Health Auditor
              </Link>
            </Button>
          </div>

          {/* Audit preview card */}
          <div className="relative animate-in slide-in-from-right-12 duration-1000">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#0070f3]/5 to-transparent blur-3xl rounded-full" />
            <Card className="relative p-10 shadow-2xl border-[#e5e7eb] rounded-[32px]">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h4 className="font-bold text-[#0a0a0a]">ml-inference-service</h4>
                  <p className="text-xs text-[#9ca3af] mt-1 font-medium tracking-tight">LAST SCANNED: 2 MIN AGO</p>
                </div>
                <Badge variant="warning" className="h-6 px-3">NEEDS ATTENTION</Badge>
              </div>

              <div className="flex items-center justify-center mb-10">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="74" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                    <circle
                      cx="80" cy="80" r="74" fill="none"
                      stroke="#f59e0b" strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray="465"
                      strokeDashoffset={465 * (1 - 0.61)}
                    />
                  </svg>
                  <div className="text-center">
                    <span className="text-5xl font-bold text-[#0a0a0a]">61</span>
                    <span className="block text-xs font-bold text-[#9ca3af] mt-1">/100</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Unprotected main branch', score: 'CRITICAL', color: 'bg-[#ef4444]' },
                  { label: 'Missing CI/CD workflow', score: 'CRITICAL', color: 'bg-[#ef4444]' },
                  { label: 'No security disclosure policy', score: 'WARNING', color: 'bg-[#f59e0b]' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-2xl border border-[#f3f4f6] hover:bg-[#fafafa] transition-colors cursor-default">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-xs font-semibold text-[#0a0a0a]">{item.label}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      item.score === 'CRITICAL' ? 'text-[#ef4444] border-[#fecaca] bg-[#fee2e2]' : 'text-[#f59e0b] border-[#fde68a] bg-[#fef3c7]'
                    }`}>
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="bg-[#fafafa] py-16 sm:py-24 md:py-32 border-y border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6 tracking-tight">Start simple. Scale fast.</h2>
            <p className="text-[#6b7280] text-lg max-w-lg mx-auto">Free for public open-source projects. Transparent pricing for commercial teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Hobby',
                price: '$0',
                features: ['Unlimited public repos', 'Standard presets', 'Manual audits', 'Community support'],
                cta: 'Get started for free',
                highlight: false
              },
              {
                name: 'Pro',
                price: '$12',
                period: '/mo',
                badge: 'Recommended',
                features: ['Unlimited private repos', 'All presets & rules', 'Automated cleanup', 'Priority email support', 'Audit history (30 days)'],
                cta: 'Start 14-day Pro trial',
                highlight: true
              },
              {
                name: 'Team',
                price: '$49',
                period: '/mo',
                features: ['Everything in Pro', 'Custom organization presets', 'Team dashboard', 'SAML/SSO integration', 'Dedicated account manager'],
                cta: 'Talk to sales',
                highlight: false
              }
            ].map((plan) => (
              <Card key={plan.name} className={`p-10 flex flex-col relative transition-all duration-500 overflow-hidden ${
                plan.highlight ? 'border-[#0070f3] border-2 shadow-xl scale-105 z-10' : 'hover:scale-[1.02]'
              }`}>
                {plan.badge && (
                  <div className="absolute top-0 right-0 p-1">
                    <span className="bg-[#0070f3] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">{plan.badge}</span>
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-[#6b7280] uppercase tracking-widest mb-4">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-[#0a0a0a]">{plan.price}</span>
                    <span className="text-[#9ca3af] font-medium">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-[#374151]">
                      <svg className="w-5 h-5 text-[#10b981] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full h-12 shadow-sm" variant={plan.highlight ? 'primary' : 'secondary'}>
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="bg-[#0070f3] py-12 sm:py-24 text-white text-center rounded-2xl sm:rounded-3xl mx-4 sm:mx-6 my-10 sm:my-20">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Ready to standardize?</h2>
          <p className="text-white/80 text-xl mb-10">Join 10,000+ developers automating their repository standards with RepoForge.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-[#0070f3] hover:bg-white/90 px-8 h-12 text-sm font-bold shadow-lg" asChild>
              <Link href="/onboarding">
                Get started free
              </Link>
            </Button>
            <Button className="bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 h-12 text-sm font-bold" asChild>
              <Link href="/dashboard">
                Go to dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#e5e7eb] py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl text-[#0a0a0a] mb-6">
                <div className="w-8 h-8 bg-[#0070f3] rounded-lg grid grid-cols-2 gap-px p-1.5 shadow-sm shadow-blue-500/20">
                  <div className="bg-white rounded-[1px]" />
                  <div className="bg-white rounded-[1px]" />
                  <div className="bg-white rounded-[1px]" />
                  <div className="bg-white rounded-[1px]" />
                </div>
                RepoForge
              </div>
              <p className="text-[#6b7280] text-sm leading-relaxed max-w-xs">
                The developer standard for automated GitHub repository configuration and health monitoring.
              </p>
            </div>

            {[
              { title: 'Product', links: [ {label:'Features', href:'#'}, {label:'Auditor', href:'#audit'}, {label:'Presets', href:'#'}, {label:'CLI', href:'#'} ] },
              { title: 'Company', links: [ {label:'About', href:'#'}, {label:'Blog', href:'#'}, {label:'Careers', href:'#'}, {label:'GitHub', href:'#'} ] },
              { title: 'Legal', links: [ {label:'Privacy', href:'#'}, {label:'Terms', href:'#'}, {label:'Security', href:'#'} ] },
            ].map(section => (
              <div key={section.title}>
                <h4 className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-[0.2em] mb-6">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map(link => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-[#6b7280] hover:text-[#0070f3] transition-all duration-300">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-[#f3f4f6] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-[#9ca3af] font-medium">© 2026 RepoForge Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-[10px] font-bold text-[#10b981] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                Systems Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
