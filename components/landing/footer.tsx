'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Repo<span className="text-primary bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Forge</span></span>
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Building the future of repository intelligence and automated developer workflows.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#product" className="text-muted-foreground hover:text-foreground transition-colors">Product</Link></li>
              <li><Link href="#audit" className="text-muted-foreground hover:text-foreground transition-colors">Audit</Link></li>
              <li><Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Social</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter / X</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">LinkedIn</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Discord</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">Our Story</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Team</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RepoForge Inc. All rights reserved. Built with passion by a dedicated team of developers.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
