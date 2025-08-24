import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ThemeProvider } from '@/components/theme-provider';

const RootLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <div className="min-h-screen bg-[#0A1628] antialiased">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-[#0A1628]/80 backdrop-blur-sm">
          <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">ST</span>
              </div>
              <div>
                <h1 className="font-semibold text-white">Smart Toilet</h1>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            </Link>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <nav className="flex items-center space-x-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="secondary" className="px-4">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="text-gray-400 hover:text-white"
                      onClick={() => {/* TODO: Implement logout */}}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" className="text-gray-400 hover:text-white">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button className="bg-emerald-500 hover:bg-emerald-600">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 bg-[#0A1628]/80">
          <div className="container py-6 md:py-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/features" className="text-gray-400 hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="text-gray-400 hover:text-white">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/about" className="text-gray-400 hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-400 hover:text-white">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/blog" className="text-gray-400 hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs" className="text-gray-400 hover:text-white">
                      Documentation
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/privacy" className="text-gray-400 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-gray-400 hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-center text-gray-400">
                © {new Date().getFullYear()} Smart Toilet Management System. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default RootLayout;
