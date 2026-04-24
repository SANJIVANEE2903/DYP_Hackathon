'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  SearchCode, 
  BarChart3, 
  Zap 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const auditHighlights = [
  {
    title: 'Code structure analysis',
    description: 'Automatic detection of architectural patterns and potential design flaws.',
    icon: SearchCode,
    color: 'text-blue-500'
  },
  {
    title: 'Performance insights',
    description: 'Detailed metrics on load times, bundle sizes, and runtime efficiency.',
    icon: BarChart3,
    color: 'text-emerald-500'
  },
  {
    title: 'Security checks',
    description: 'Real-time scanning for vulnerabilities and insecure configuration patterns.',
    icon: ShieldCheck,
    color: 'text-purple-500'
  },
  {
    title: 'Optimization suggestions',
    description: 'Actionable AI-generated advice to improve codebase maintainability.',
    icon: Zap,
    color: 'text-amber-500'
  }
];

export function Audit() {
  return (
    <section id="audit" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black mb-6 tracking-tight"
            >
              Intelligent <br /> Repository Audit
            </motion.h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              RepoForge doesn't just build; it monitors. Our intelligent audit system continuously scans your repositories to ensure they stay healthy and secure.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {auditHighlights.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50"
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-semibold">{item.title}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <motion.div
              initial={{ opacity: 0, rotate: -5 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <Card className="p-8 rounded-[2rem] border-border/50 bg-background shadow-2xl shadow-primary/10 overflow-hidden">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Audit Report</span>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '85%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-primary" 
                    />
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Security Health', value: '98%' },
                      { label: 'Code Quality', value: '92%' },
                      { label: 'Performance', value: '87%' }
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{row.label}</span>
                        <span className="text-sm font-bold text-primary">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
            {/* Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[100px] -z-10 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
