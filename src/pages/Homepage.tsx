import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const Homepage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Simple Header */}
      <header className="p-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">ST</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold">Smart Toilet</span>
              <span className="text-sm text-muted-foreground">Management System</span>
            </div>
          </div>
          
          <div>
            <Link to="/login">
              <Button variant="outline" className="mr-3">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Simple Hero Section */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">
            Smart <span className="text-primary">Hygiene</span> Management
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Revolutionary IoT-powered solution for maintaining world-class hygiene standards 
            across India's highway rest stops.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button variant="primary" size="lg">
                Access Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-border py-12 px-6 text-center">
        <p className="text-muted-foreground">
          © 2024 Smart Toilet Management System. Powered by IoT & AI.
        </p>
      </footer>
    </div>
  );
};

export default Homepage;