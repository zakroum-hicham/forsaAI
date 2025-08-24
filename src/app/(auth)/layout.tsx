import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "next-themes";
import { Toaster } from 'sonner';
import Logo from '@/components/Logo';
import { ModeToggle } from '@/components/ui/ModeToggle';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ForsaAI - Recruiting Intelligence Platform',
  description: 'AI-powered technical recruitment platform',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <header className="py-4 px-6 flex justify-between items-center">
                  <Logo />
                  <div className="flex items-center space-x-4">
                    <ModeToggle />
                    <Link 
                      href="/" 
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Back to Home
                    </Link>
                  </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow flex items-center justify-center p-4">
                  <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 border dark:border-gray-700">
                      {children}
                    </div>
                  </div>
                </main>

                {/* Footer */}
                <footer className="py-6 px-4 text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-800">
                  <div className="max-w-7xl mx-auto">
                    <p>© {new Date().getFullYear()} ForasAI. All rights reserved.</p>
                    <div className="mt-2 flex justify-center space-x-6">
                      <Link href="/terms" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        Terms
                      </Link>
                      <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        Privacy Policy
                      </Link>
                      <Link href="/contact" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        Contact
                      </Link>
                    </div>
                  </div>
                </footer>
              </div>
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
          </ThemeProvider>
  );
}