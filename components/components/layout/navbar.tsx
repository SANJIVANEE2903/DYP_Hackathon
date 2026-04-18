'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-[#e5e7eb] h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-[#0a0a0a]">
          <div className="w-6 h-6 bg-[#0070f3] rounded grid grid-cols-2 gap-0.5 p-1">
            <div className="bg-white rounded-sm" />
            <div className="bg-white rounded-sm" />
            <div className="bg-white rounded-sm" />
            <div className="bg-white rounded-sm" />
          </div>
          RepoForge
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-[#6b7280] hover:text-[#0a0a0a]">
            Features
          </Link>
          <Link href="#audit" className="text-sm text-[#6b7280] hover:text-[#0a0a0a]">
            Audit
          </Link>
          <Link href="#presets" className="text-sm text-[#6b7280] hover:text-[#0a0a0a]">
            Presets
          </Link>
          <Link href="#pricing" className="text-sm text-[#6b7280] hover:text-[#0a0a0a]">
            Pricing
          </Link>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm text-[#6b7280] hover:text-[#0a0a0a] hover:bg-[#f3f4f6] rounded-md transition-colors">
            Sign in
          </button>
          <button className="px-4 py-2 text-sm bg-[#0070f3] text-white rounded-lg hover:bg-[#0060df] transition-colors font-medium">
            Get started free
          </button>
        </div>
      </div>
    </nav>
  );
}
