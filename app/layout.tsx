import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SupabaseProvider from '@/components/providers/supabase-provider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'RepoForge - Repository Configuration Made Easy',
  description: 'Automatically configure GitHub repositories with AI-powered setup. CI/CD, branch protection, templates, and health auditing.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#0070f3',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#ffffff]">
      <body className={`${inter.className} font-sans antialiased bg-[#ffffff] text-[#0a0a0a]`}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
