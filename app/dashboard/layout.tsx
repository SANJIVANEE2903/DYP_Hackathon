'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  GitBranch,
  ShieldCheck, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  Search,
  Layers,
  Sun,
  Moon,
  Menu,
  X,
  Calendar,
  Key
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
// Force recompile to resolve stale browser ReferenceError
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

const sidebarItems = [
  { name: 'Homepage', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Repositories', href: '/dashboard/repos', icon: GitBranch },
  { name: 'Health Audit', href: '/dashboard/audit', icon: ShieldCheck },
  { name: 'History', href: '/dashboard/history', icon: Layers },
  { name: 'Create Token', href: '/dashboard/tokens', icon: Key },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateToken = () => {
    router.push('/dashboard/tokens');
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border-2 border-primary/20"
        >
          <div className="w-8 h-8 rounded-lg bg-primary shadow-lg shadow-primary/40 flex items-center justify-center">
            <span className="text-primary-foreground font-black text-xl">R</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const displayName = user.name || user.login || user.github_username || user.email.split('@')[0];
  const avatarFallback = displayName[0]?.toUpperCase();

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={() => mobile && setIsMobileOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-primary flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-black text-xl">R</span>
          </div>
          {(!isCollapsed || mobile) && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-black text-2xl tracking-tighter"
            >
              Repo<span className="text-primary bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">Forge</span>
            </motion.span>
          )}
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-6">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => {
                if (item.name === 'Create Token') {
                  e.preventDefault();
                  handleCreateToken();
                }
                if (mobile) setIsMobileOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/10' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600"
                />
              )}
              <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform duration-300'}`} />
              {(!isCollapsed || mobile) && (
                <span className="font-bold text-sm relative z-10 tracking-tight">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 bg-muted/30">
        {(!isCollapsed || mobile) && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-[1.25rem] bg-card border border-border/50 shadow-sm mb-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar className="w-9 h-9 border border-border shadow-inner">
                <AvatarImage src={user.avatar_url} alt={displayName} />
                <AvatarFallback className="bg-secondary font-black text-xs">{avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Active User</p>
                <p className="text-sm font-bold truncate leading-tight">{displayName}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-full flex items-center gap-3 rounded-xl transition-all ${isCollapsed && !mobile ? 'justify-center p-3' : 'justify-start px-4 py-3'}`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            {(!isCollapsed || mobile) && <span className="font-bold text-sm">Theme Mode</span>}
          </Button>

          <Button 
            variant="ghost" 
            onClick={logout}
            className={`w-full flex items-center gap-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all ${isCollapsed && !mobile ? 'justify-center p-3' : 'justify-start px-4 py-3'}`}
          >
            <LogOut className="w-5 h-5" />
            {(!isCollapsed || mobile) && <span className="font-bold text-sm">Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex selection:bg-primary/10 selection:text-primary">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 100 : 300 }}
        className="fixed left-0 top-0 bottom-0 z-40 bg-card border-r border-border/50 hidden md:flex flex-col shadow-2xl shadow-black/5"
      >
        <SidebarContent />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-xl hover:scale-110 active:scale-90"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${isCollapsed ? 'md:ml-[100px]' : 'md:ml-[300px]'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/60 backdrop-blur-xl border-b border-border/40 h-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Nav Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-2xl w-12 h-12 bg-secondary/50">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-none w-[300px] bg-card">
                <SidebarContent mobile />
              </SheetContent>
            </Sheet>

            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <h2 className="text-xl font-black tracking-tight">
                {sidebarItems.find(i => i.href === pathname)?.name || 'Dashboard'}
              </h2>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border/50">
                <ShieldCheck className="w-3 h-3" />
                Verified Infrastructure
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-secondary/30 border border-border/50">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Current Period</span>
                <span className="text-xs font-bold">{format(new Date(), 'MMMM yyyy')}</span>
              </div>
              <Calendar className="w-5 h-5 opacity-40" />
            </div>

            <Button variant="outline" size="icon" className="rounded-2xl w-12 h-12 relative border-border/50 hover:bg-secondary transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background ring-4 ring-primary/10 animate-pulse" />
            </Button>

            <Avatar className="w-12 h-12 border-2 border-border/50 cursor-pointer hover:border-primary transition-all md:hidden rounded-2xl">
              <AvatarImage src={user.avatar_url} alt={displayName} />
              <AvatarFallback className="bg-secondary font-black">{avatarFallback}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Area */}
        <main className="p-6 md:p-12 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer info */}
        <footer className="mt-auto px-12 py-8 border-t border-border/40 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 RepoForge Engineering Standards Platform</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-primary transition-colors">API Status</Link>
            <Link href="#" className="hover:text-primary transition-colors">Security</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
