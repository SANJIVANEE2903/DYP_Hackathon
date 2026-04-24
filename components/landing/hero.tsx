'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal } from './terminal';
import { ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative pt-32 pb-32 px-6 overflow-hidden min-h-screen flex items-center">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Terminal Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative z-10">
              <Terminal />
            </div>
            {/* Shadow decoration */}
            <div className="absolute -z-10 inset-0 translate-y-12 bg-primary/10 blur-[100px] scale-90 opacity-50" />
            
            {/* Floating badge over terminal */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-6 -right-6 z-20 bg-background/80 backdrop-blur-md border border-border p-4 rounded-2xl shadow-2xl hidden md:flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Github className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
                <p className="text-sm font-bold">Connected to GitHub</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Hero Content */}
          <div className="text-left order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 uppercase tracking-widest"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              From idea to GitHub repo — in one step
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]"
            >
              Build <br /> 
              repositories at <br /> 
              the <span className="text-primary bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">speed of thought.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl"
            >
              RepoForge understands natural language and automatically builds complete repositories, sets up environments, and connects to GitHub — instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Button asChild size="lg" className="h-14 px-10 rounded-full text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 w-full sm:w-auto">
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-10 rounded-full text-lg font-bold hover:bg-secondary transition-all duration-300 w-full sm:w-auto border-border/50">
                <Link href="/login" className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  Connect GitHub
                </Link>
              </Button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
