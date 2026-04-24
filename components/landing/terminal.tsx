'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const commands = [
  { text: 'RepoForge AI Engine', delay: 500, type: 'success' },
  { text: 'Understanding request: "Create a full-stack app with authentication"', delay: 1000 },
  { text: '✔ Designing system architecture...', delay: 800, type: 'output' },
  { text: '✔ Applying industry best practices...', delay: 600, type: 'output' },
  { text: '✔ Setting up frontend & backend...', delay: 700, type: 'output' },
  { text: '✔ Installing dependencies...', delay: 500, type: 'output' },
  { text: '✔ Configuring environment...', delay: 600, type: 'output' },
  { text: '✔ Creating GitHub repository...', delay: 900, type: 'output' },
  { text: '✔ Setting up workflows...', delay: 500, type: 'output' },
  { text: '✓ Project ready: github.com/user/my-app', delay: 1000, type: 'success' },
  { text: 'Ready for development.', delay: 500, type: 'output' },
];

export function Terminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (visibleLines < commands.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, commands[visibleLines].delay);
      return () => clearTimeout(timer);
    } else {
      // Reset after a long delay
      const timer = setTimeout(() => setVisibleLines(0), 5000);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] shadow-2xl terminal-glow">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a1a] bg-[#0f0f0f]">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-2 text-xs font-mono text-[#4a4a4a]">bash — repoforge — 80x24</span>
      </div>
      <div className="p-6 font-mono text-sm sm:text-base h-[320px] overflow-y-auto custom-scrollbar">
        {commands.slice(0, visibleLines).map((cmd, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-2 ${
              cmd.type === 'output' ? 'text-zinc-400' : 
              cmd.type === 'success' ? 'text-emerald-400' : 
              cmd.type === 'warning' ? 'text-amber-400' : 
              'text-white'
            }`}
          >
            {cmd.type !== 'output' && cmd.type !== 'success' && cmd.type !== 'warning' && (
              <span className="text-emerald-500 mr-2">$</span>
            )}
            {cmd.text}
          </motion.div>
        ))}
        {visibleLines < commands.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-5 bg-emerald-500 align-middle ml-1"
          />
        )}
      </div>
    </div>
  );
}
