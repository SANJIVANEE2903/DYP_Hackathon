import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import 'lenis/dist/lenis.css'
import { AuthProvider } from '@/hooks/use-auth'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { LenisProvider } from '@/components/providers/lenis-provider'
import SupabaseProvider from '@/components/providers/supabase-provider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'RepoForge - Premium Developer Tool',
  description: 'AI-powered repository health auditing and automated configuration.',
  generator: 'RepoForge',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SupabaseProvider>
            <LenisProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </LenisProvider>
          </SupabaseProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}