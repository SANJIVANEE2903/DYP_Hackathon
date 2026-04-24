'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Settings2, 
  Github, 
  Cpu, 
  Workflow,
  Layers,
  Server,
  Layout
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const productFeatures = [
  {
    title: 'Full-stack project generation',
    description: 'Create complete frontend and backend codebases tailored to your specific project needs.',
    icon: Layers
  },
  {
    title: 'Backend setup (APIs, structure)',
    description: 'Automatically configure scalable API architectures, database connections, and environment settings.',
    icon: Server
  },
  {
    title: 'GitHub repo creation & management',
    description: 'Instantly provision repositories on GitHub and manage them through our intuitive natural language interface.',
    icon: Github
  },
  {
    title: 'Workflow automation',
    description: 'Set up production-ready CI/CD pipelines, branch protections, and automated testing workflows.',
    icon: Workflow
  },
  {
    title: 'Industry-standard folder structure',
    description: 'Every repository follows battle-tested organizational patterns used by top engineering teams.',
    icon: Layout
  },
  {
    title: 'AI-Powered Orchestration',
    description: 'Our engine handles the complex logic of connecting your frontend, backend, and infrastructure.',
    icon: Cpu
  }
];

export function Product() {
  return (
    <section id="product" className="py-24 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-4 tracking-tight"
          >
            What RepoForge Can Do
          </motion.h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            RepoForge transforms your ideas into **fully structured, backend-ready, production-grade repositories** and automates GitHub operations using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-8 rounded-[2rem] border-border/50 bg-background hover:border-primary/20 transition-all group shadow-lg shadow-black/5 h-full">
                <div className="flex flex-col gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
