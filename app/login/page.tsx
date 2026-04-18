'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGitHubLoading, setIsGitHubLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Signed in successfully!')
      router.push('/dashboard')
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleGitHubLogin = async () => {
    setIsGitHubLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      setIsGitHubLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-[#0a0a0a] mb-12">
        <div className="w-8 h-8 bg-[#0070f3] rounded-lg grid grid-cols-2 gap-px p-1.5 shadow-sm shadow-blue-500/20">
          <div className="bg-white rounded-[1px]" />
          <div className="bg-white rounded-[1px]" />
          <div className="bg-white rounded-[1px]" />
          <div className="bg-white rounded-[1px]" />
        </div>
        RepoForge
      </Link>

      <Card className="w-full max-w-md p-8 shadow-xl border-[#e5e7eb] rounded-3xl bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0070f3] to-[#00a3ff]" />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0a0a0a] mb-2">Welcome back</h1>
          <p className="text-sm text-[#6b7280]">Connect your GitHub to manage your engineering standards.</p>
        </div>

        <div className="space-y-4">
          <Button 
            variant="secondary" 
            className="w-full h-12 gap-3 font-semibold border-[#e5e7eb] hover:bg-[#fafafa]"
            onClick={handleGitHubLogin}
            disabled={isGitHubLoading || isLoading}
          >
            {isGitHubLoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02-.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            )}
            Continue with GitHub
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#f3f4f6]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-[#9ca3af] font-bold tracking-widest">or email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider ml-1">Email address</label>
              <Input 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-11 shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">Password</label>
                <Link href="#" className="text-[10px] font-bold text-[#0070f3] hover:underline uppercase tracking-wide">Forgot?</Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-11 shadow-sm"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 font-bold shadow-lg shadow-blue-500/20 mt-2"
              disabled={isLoading || isGitHubLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in to RepoForge'}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-[#6b7280]">
          Don't have an account?{' '}
          <Link href="/onboarding" className="font-bold text-[#0070f3] hover:underline">Start free trial</Link>
        </p>
      </Card>

      <div className="mt-12 flex items-center gap-6">
        <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          Secure with Supabase Auth
        </p>
      </div>
    </div>
  )
}
