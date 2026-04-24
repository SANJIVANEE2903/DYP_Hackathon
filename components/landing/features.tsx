'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquareText, 
  Rocket, 
  Github, 
  SearchCode, 
  LayoutTemplate, 
  ShieldCheck,
  Zap,
  ShieldAlert,
  Database
} from 'lucide-react';

const features = [
  {
    title: 'Natural Language Control',
    description: 'Create repositories and manage GitHub tasks using simple, human language.',
    icon: MessageSquareText,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'One-Step Repository Creation',
    description: 'Generate complete, production-ready repositories instantly with no manual setup.',
    icon: Rocket,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    title: 'GitHub Task Automation',
    description: 'Automate repository creation, commits, workflows, and integrations directly with GitHub.',
    icon: Zap,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    title: 'Industry-Standard Architecture',
    description: 'Every project follows scalable, clean, and real-world development practices.',
    icon: Database,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
  {
    title: 'AI-Powered Audit',
    description: 'Analyze and optimize repositories with intelligent insights and recommendations.',
    icon: SearchCode,
    color: 'text-zinc-500',
    bg: 'bg-zinc-500/10'
  },
  {
    title: 'Secure Token System',
    description: 'Generate and manage tokens to securely connect RepoForge with your GitHub workflows.',
    icon: ShieldCheck,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10'
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 relative overflow-hidden">
      {/* Subtle background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-30">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
          >
            Powerful Features, <span className="text-primary">Simplified</span> Development
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to go from idea to production-ready repository — faster, smarter, and fully automated.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="p-8 rounded-[2rem] bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden glass shadow-xl shadow-black/5"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>
              
              {/* Decorative corner element */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
