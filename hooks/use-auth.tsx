'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface User {
  id: string;
  email: string;
  github_connected: boolean;
  github_username?: string;
  login?: string;
  name?: string;
  avatar_url?: string;
  username?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  githubLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [githubLoading, setGithubLoading] = useState(false);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      // 1. Check for Guest Mode first (Bypass)
      const isGuest = localStorage.getItem('repoforge_guest') === 'true';
      if (isGuest) {
        setUser({
          id: 'guest-user-id',
          email: 'admin@repoforge.io',
          github_connected: true,
          login: 'repoforge-admin',
          name: 'RepoForge Admin (Guest)',
          avatar_url: 'https://github.com/identicons/guest.png'
        });
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setUser(null);
        return;
      }

      // Try backend first, fallback to Supabase session data
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          return;
        }
      } catch {
        // Backend unavailable — use Supabase session as fallback
      }

      // Fallback: construct user from Supabase session
      const supaUser = session.user;
      setUser({
        id: supaUser.id,
        email: supaUser.email || '',
        github_connected: !!supaUser.user_metadata?.user_name,
        github_username: supaUser.user_metadata?.user_name,
        login: supaUser.user_metadata?.user_name,
        name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name,
        avatar_url: supaUser.user_metadata?.avatar_url,
      });
      // Sync with "profiles" table as required by the spec
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supaUser.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Create profile if missing
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: supaUser.id,
            email: supaUser.email,
            username: supaUser.user_metadata?.user_name || supaUser.email?.split('@')[0],
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (!createError && newProfile) {
          setUser(prev => ({ ...prev, ...newProfile } as User));
        }
      } else if (profile) {
        setUser(prev => ({ ...prev, ...profile } as User));
      }

    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        localStorage.setItem('repoforge_token', session.access_token);
      } else {
        localStorage.removeItem('repoforge_token');
      }

      if (event === 'SIGNED_IN') {
        await fetchUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const loginGuest = () => {
    const guestUser: User = {
      id: 'guest-user-id',
      email: 'admin@repoforge.io',
      github_connected: true,
      login: 'repoforge-admin',
      name: 'RepoForge Admin (Guest)',
      avatar_url: 'https://github.com/identicons/guest.png'
    };
    setUser(guestUser);
    localStorage.setItem('repoforge_guest', 'true');
    // Set a cookie so the middleware can see it
    document.cookie = "repoforge_guest=true; path=/; max-age=86400";
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('repoforge_guest');
      // Clear cookie
      document.cookie = "repoforge_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      githubLoading,
      signIn, 
      signUp, 
      logout,
      refreshUser,
      loginGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
