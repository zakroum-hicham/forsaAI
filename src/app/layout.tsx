import { Toaster } from 'sonner'
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'ForsaAI SaaS',
  description: 'AI-powered candidate ranking platform',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (

    <html lang="en" suppressHydrationWarning>
      <body>
        <main>
          <Toaster
              position="top-center"
              richColors
              expand
              closeButton
              toastOptions={{
                classNames: {
                  toast: 'font-sans',
                  title: 'font-medium',
                },
              }}
            />
          {children}
        </main>
      </body>
    </html>
  )
}
