import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import './globals.css'

export const metadata: Metadata = {
  title: 'LexiZW — AI Legal Suite for Zimbabwe',
  description: 'Legal research, contract drafting, and court forms powered by AI — built for Zimbabwean lawyers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en">
        <body className="bg-gray-50 text-gray-900 antialiased">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  )
}
