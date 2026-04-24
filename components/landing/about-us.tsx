'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Sparkles, HeartHandshake } from 'lucide-react';
import { Card } from '@/components/ui/card';

const teamMembers = [
  { name: 'Chaitanya', role: 'Product Strategy' },
  { name: 'Bhargavi', role: 'UI/UX Design' },
  { name: 'Ashvini', role: 'Core Engineering' },
  { name: 'Sanjivanee', role: 'System Architecture' }
];

export function AboutUs() {
  return (
    <section id="about" className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">About RepoForge</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  RepoForge was founded with a singular mission: to simplify the complexity of modern repository management through intelligent automation.
                </p>
                <p>
                  We believe that developers should spend their time writing code, not wrestling with boilerplate configurations or manual health checks.
                </p>
              </div>
            </motion.div>

            <div className="mt-12 p-8 rounded-[2rem] bg-primary text-primary-foreground shadow-xl shadow-primary/10">
              <div className="flex gap-4 items-start mb-4">
                <Target className="w-8 h-8 shrink-0" />
                <h3 className="text-2xl font-bold italic">"Empowering developers to forge production-ready repositories at the speed of thought."</h3>
              </div>
              <p className="text-primary-foreground/80 font-medium">— Our Vision Statement</p>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              The Creative Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 rounded-2xl border-border/50 bg-background hover:border-primary/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
                        <Sparkles className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{member.name}</h4>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{member.role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <Card className="p-8 rounded-[2rem] bg-background border-border/50 flex items-center justify-center text-center">
              <div>
                <HeartHandshake className="w-8 h-8 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Built with passion by a dedicated team of developers.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
