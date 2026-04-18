'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, supabase } = useSupabase()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#f3f4f6] h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-[#0a0a0a]">
          <div className="w-6 h-6 bg-[#0070f3] rounded grid grid-cols-2 gap-px p-1 shrink-0">
            <div className="bg-white rounded-[1px]" />
            <div className="bg-white rounded-[1px]" />
            <div className="bg-white rounded-[1px]" />
            <div className="bg-white rounded-[1px]" />
          </div>
          RepoForge
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-7">
          <Link href="/#features" className="text-sm text-[#6b7280] hover:text-[#0a0a0a] transition-colors">Features</Link>
          <Link href="/#audit" className="text-sm text-[#6b7280] hover:text-[#0a0a0a] transition-colors">Audit</Link>
          <Link href="/#presets" className="text-sm text-[#6b7280] hover:text-[#0a0a0a] transition-colors">Presets</Link>
          <Link href="/#pricing" className="text-sm text-[#6b7280] hover:text-[#0a0a0a] transition-colors">Pricing</Link>
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[#6b7280] hover:text-[#0a0a0a] hover:bg-[#f3f4f6] rounded-md px-3 py-1.5 text-sm transition-colors"
              >
                Dashboard
              </Link>
              <Button
                variant="ghost"
                onClick={() => supabase.auth.signOut()}
                className="text-sm font-medium h-9"
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[#6b7280] hover:text-[#0a0a0a] hover:bg-[#f3f4f6] rounded-md px-3 py-1.5 text-sm transition-colors"
              >
                Sign in
              </Link>
              <Button asChild className="h-9 px-4 text-xs font-bold">
                <Link href="/onboarding">
                  Get started free
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-[#6b7280] hover:bg-[#f3f4f6] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-[#e5e7eb] px-6 py-4 space-y-3 md:hidden shadow-sm">
          <Link href="/#features" className="block text-sm text-[#6b7280] hover:text-[#0a0a0a] py-1">Features</Link>
          <Link href="/#audit" className="block text-sm text-[#6b7280] hover:text-[#0a0a0a] py-1">Audit</Link>
          <Link href="/#presets" className="block text-sm text-[#6b7280] hover:text-[#0a0a0a] py-1">Presets</Link>
          <Link href="/#pricing" className="block text-sm text-[#6b7280] hover:text-[#0a0a0a] py-1">Pricing</Link>
          <div className="pt-2 border-t border-[#e5e7eb] flex flex-col gap-2">
            <Link href="/dashboard" className="text-sm text-[#6b7280] py-1">Sign in</Link>
            <Link href="/onboarding" className="bg-[#0070f3] text-white rounded-lg px-4 py-2 text-sm font-medium text-center">Get started free</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
