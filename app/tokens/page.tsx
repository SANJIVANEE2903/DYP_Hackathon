'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  ArrowLeft, 
  Copy, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  Github, 
  Search, 
  Plus,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

export default function CreateTokenPage() {
  const [tokenName, setTokenName] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newToken = 'rf_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setGeneratedToken(newToken);
    setIsGenerating(false);
    
    toast({
      title: "Token generated successfully",
      description: "Please copy and store your token securely.",
    });
  };

  const copyToClipboard = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Your token has been copied.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to landing page
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4 tracking-tight">Generate Your Access Token</h1>
            <p className="text-muted-foreground text-lg">
              Create a secure token to connect RepoForge with your repositories and automate workflows.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!generatedToken ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-12"
              >
                <Card className="rounded-[2.5rem] border-border bg-card shadow-2xl shadow-black/5 overflow-hidden">
                  <form onSubmit={handleGenerate}>
                    <CardHeader className="p-10 pb-0">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                        <Key className="w-7 h-7 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">Token Details</CardTitle>
                      <CardDescription>Give your token a descriptive name and set its permissions.</CardDescription>
                    </CardHeader>

                    <CardContent className="p-10 space-y-8">
                      <div className="space-y-3">
                        <Label htmlFor="token-name" className="text-base font-bold">Token Name</Label>
                        <Input 
                          id="token-name" 
                          placeholder="e.g. CI/CD Deployment Token" 
                          className="h-14 rounded-2xl border-border bg-muted/30 focus:ring-primary px-6"
                          value={tokenName}
                          onChange={(e) => setTokenName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base font-bold">Permissions</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { id: 'repo', label: 'Repository Access', icon: Github },
                            { id: 'workflow', label: 'Workflow Automation', icon: Plus },
                            { id: 'audit', label: 'Audit Access', icon: Search },
                          ].map((perm) => (
                            <div key={perm.id} className="flex items-center space-x-3 p-4 rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                              <Checkbox id={perm.id} defaultChecked />
                              <perm.icon className="w-4 h-4 text-muted-foreground" />
                              <label htmlFor={perm.id} className="text-sm font-medium leading-none cursor-pointer">
                                {perm.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                        disabled={isGenerating || !tokenName}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Generating Token...
                          </>
                        ) : (
                          'Generate Token'
                        )}
                      </Button>
                    </CardContent>
                  </form>
                </Card>

                {/* GitHub Token Guide */}
                <div className="pt-12 border-t border-border">
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold mb-2">How to Generate a GitHub Access Token</h2>
                    <p className="text-muted-foreground">Follow these steps to create a personal access token from GitHub to securely connect your repositories with RepoForge.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { step: '01', text: 'Log in to GitHub' },
                      { step: '02', text: 'Go to Settings' },
                      { step: '03', text: 'Open Developer Settings' },
                      { step: '04', text: 'Click Personal Access Tokens' },
                      { step: '05', text: 'Select Generate new token' },
                      { step: '06', text: 'Choose permissions (repo, workflow)' },
                      { step: '07', text: 'Generate and copy token' },
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                        <span className="text-primary font-black text-sm pt-0.5">{step.step}</span>
                        <p className="text-sm font-medium leading-tight">{step.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-start gap-4 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-700/80 font-medium leading-relaxed">
                      Keep your token secure. Do not share it publicly.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="rounded-[2.5rem] border-emerald-500/20 bg-emerald-500/5 shadow-2xl shadow-emerald-500/5 overflow-hidden">
                  <CardContent className="p-10 text-center space-y-8">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                      <ShieldCheck className="w-10 h-10 text-emerald-500" />
                    </div>
                    
                    <div>
                      <h2 className="text-3xl font-black text-emerald-500 mb-2">Token generated successfully</h2>
                      <p className="text-muted-foreground">Successfully created token for: <span className="font-bold text-foreground">{tokenName}</span></p>
                    </div>

                    <div className="p-6 rounded-2xl bg-background border border-emerald-500/20 flex flex-col items-center gap-4 group">
                      <div className="w-full flex items-center gap-4">
                        <code className="flex-1 font-mono text-lg text-left overflow-hidden text-ellipsis whitespace-nowrap bg-muted/30 p-2 rounded-lg">
                          {generatedToken.substring(0, 8)}••••••••••••••••
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={copyToClipboard}
                          className="rounded-xl hover:bg-emerald-500/10 shrink-0"
                        >
                          {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                        </Button>
                      </div>
                      <p className="text-xs text-emerald-600/70 font-medium italic">Token is masked for security. Use the copy button to retrieve full token.</p>
                    </div>

                    <div className="flex items-start gap-4 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left">
                      <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                      <p className="text-sm text-amber-700/80 leading-relaxed font-medium">
                        This token will be shown only once. Store it securely. If you lose it, you will need to generate a new one.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-4">
                      <Button variant="outline" onClick={() => setGeneratedToken(null)} className="rounded-xl px-8 h-12">
                        Create Another
                      </Button>
                      <Button asChild className="rounded-xl px-8 h-12">
                        <Link href="/">Back to Home</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
