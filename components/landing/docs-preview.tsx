'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Book, Code, Terminal, Settings } from 'lucide-react';

const docsSteps = [
  {
    title: 'Introduction',
    icon: Book,
    description: 'Learn the core concepts of RepoForge and how it helps maintain repository health.',
    active: true
  },
  {
    title: 'Quick Start',
    icon: Terminal,
    description: 'Get up and running in less than 2 minutes with our CLI tool.',
    active: false
  },
  {
    title: 'CLI Commands',
    icon: Code,
    description: 'Explore the full list of commands for initialization, analysis, and deployment.',
    active: false
  },
  {
    title: 'GitHub Setup',
    icon: Settings,
    description: 'Configure webhooks and automated auditing for your GitHub organization.',
    active: false
  }
];

export function DocsPreview() {
  return (
    <section id="docs" className="py-24 px-6 bg-muted/30 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 text-left">
            <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 font-medium bg-background">
              Documentation
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              AI-Driven Experience
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-xl">
              We built RepoForge to be as simple as a conversation. Our AI handles the heavy lifting of repository setup and maintenance.
            </p>
            
            <div className="space-y-4">
              {docsSteps.map((step, i) => (
                <div 
                  key={i}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                    step.active ? 'bg-background border-border shadow-md' : 'border-transparent hover:bg-background/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${step.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${step.active ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</h4>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${step.active ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl">
            <Card className="overflow-hidden border-border bg-background shadow-2xl">
              <div className="p-8 border-b border-border bg-muted/50">
                <h3 className="text-2xl font-bold mb-2">Introduction</h3>
                <p className="text-muted-foreground">The platform for modern repository management.</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <p className="text-foreground leading-relaxed">
                    RepoForge is an AI-powered repository automation platform that translates your natural language ideas into production-ready codebases. 
                  </p>
                  <p className="text-foreground leading-relaxed">
                    By leveraging advanced LLMs, RepoForge understands your project requirements and automatically configures:
                  </p>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['CI/CD Workflows', 'Branch Protection', 'Issue Templates', 'Code Quality Checks', 'Security Headers', 'Dependency Policies'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-medium text-primary cursor-pointer hover:underline">Read the full guide</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Updated 2 days ago</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
