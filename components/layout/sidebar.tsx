'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    name: 'Repositories',
    href: '/dashboard/repos',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 3h18v18H3zM3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    name: 'Health Audit',
    href: '/dashboard/audit',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    name: 'Presets',
    href: '/dashboard/presets',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="20" y2="12" />
        <line x1="12" y1="18" x2="20" y2="18" />
        <circle cx="4" cy="12" r="2" />
        <circle cx="8" cy="18" r="2" />
      </svg>
    ),
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div className="w-[240px] shrink-0 border-r border-[#e5e7eb] bg-white h-screen flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#e5e7eb]">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[#0a0a0a] text-sm">
          <div className="w-6 h-6 bg-[#0070f3] rounded grid grid-cols-2 gap-px p-1 shrink-0">
            <div className="bg-white rounded-[1px]" />
            <div className="bg-white rounded-[1px]" />
            <div className="bg-white rounded-[1px]" />
            <div className="bg-white rounded-[1px]" />
          </div>
          RepoForge
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-auto py-4 px-3">
        <ul className="space-y-0.5">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive(item.href)
                    ? 'bg-[#f3f4f6] text-[#0a0a0a] font-medium'
                    : 'text-[#6b7280] hover:text-[#374151] hover:bg-[#f9fafb]'
                )}
              >
                <span className={isActive(item.href) ? 'text-[#0a0a0a]' : 'text-[#9ca3af]'}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User profile */}
      <div className="p-3 border-t border-[#e5e7eb]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#f9fafb] transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-[#0070f3] flex items-center justify-center text-white text-xs font-semibold shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0a0a0a] truncate">Arjun Sharma</p>
            <p className="text-xs text-[#9ca3af] truncate">arjun@acmecorp.com</p>
          </div>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#dbeafe] text-[#1d4ed8] shrink-0">
            Pro
          </span>
        </div>
      </div>
    </div>
  )
}
