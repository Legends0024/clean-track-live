import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  ChevronRight,
  Shield, 
  Activity, 
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const stats = [
  {
    value: '500+',
    label: 'Facilities Monitored',
  },
  {
    value: '99.2%',
    label: 'System Uptime',
  },
  {
    value: '50K+',
    label: 'Daily Users',
  },
  {
    value: '4.8/5',
    label: 'User Rating',
  },
];

const Homepage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  const features = [
    {
      icon: <Activity className="h-8 w-8" />,
      title: 'Real-time Monitoring',
      description: 'Live hygiene tracking with IoT sensors and instant alerts for maintenance needs.'
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'AI-Powered Inspection',
      description: 'Advanced image recognition for automated cleanliness assessment and scoring.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Multi-Role Management',
      description: 'Dedicated dashboards for cleaners, supervisors, and NHAI administrators.'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Analytics & Reports',
      description: 'Comprehensive insights and performance metrics for data-driven decisions.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Quality Assurance',
      description: 'Maintain consistent hygiene standards across all facilities nationwide.'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Nationwide Coverage',
      description: 'Scalable solution designed for highway rest stops across India.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Facilities Monitored' },
    { number: '99.2%', label: 'System Uptime' },
    { number: '50K+', label: 'Daily Users' },
    { number: '4.8/5', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="relative z-10">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow-green">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">Smart Toilet</span>
              <span className="text-xs text-muted-foreground">Management System</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/login">
              <Button variant="outline" className="mr-3">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="gradient">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Smart <span className="bg-gradient-primary bg-clip-text text-transparent">Hygiene</span>
              <br />
              Management
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Revolutionary IoT-powered solution for maintaining world-class hygiene standards 
              across India's highway rest stops. Real-time monitoring, AI-driven insights, 
              and seamless management.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link to="/login">
              <Button variant="gradient" size="lg" className="px-8">
                Access Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="lg">
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <div className="text-3xl font-bold text-foreground">{stat.number}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Advanced Features for Modern Hygiene Management
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solution combining IoT sensors, AI analysis, and intuitive 
              management interfaces for optimal facility maintenance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-glass rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 lg:px-8 bg-accent/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-foreground mb-8">
                Why Choose Our Smart Solution?
              </h2>
              
              <div className="space-y-6">
                {[
                  'Reduce maintenance costs by up to 40%',
                  'Improve user satisfaction and facility ratings',
                  'Ensure compliance with hygiene standards',
                  'Real-time alerts prevent issues before they escalate',
                  'Data-driven insights for optimal resource allocation'
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-success">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="card-glass rounded-3xl p-8 text-center">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-primary rounded-2xl text-white">
                    <Clock className="h-8 w-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm opacity-90">Monitoring</div>
                  </div>
                  <div className="p-6 bg-gradient-secondary rounded-2xl text-white">
                    <BarChart3 className="h-8 w-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm opacity-90">Efficiency</div>
                  </div>
                  <div className="p-6 bg-accent/10 rounded-2xl">
                    <Users className="h-8 w-8 mx-auto mb-3 text-accent" />
                    <div className="text-2xl font-bold text-foreground">1000+</div>
                    <div className="text-sm text-muted-foreground">Staff Managed</div>
                  </div>
                  <div className="p-6 bg-accent/10 rounded-2xl">
                    <Shield className="h-8 w-8 mx-auto mb-3 text-accent" />
                    <div className="text-2xl font-bold text-foreground">99.9%</div>
                    <div className="text-sm text-muted-foreground">Reliability</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Facility Management?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of facilities already using our smart hygiene management system. 
            Experience the future of facility maintenance today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/login">
              <Button variant="gradient" size="lg" className="px-8">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-foreground">Smart Toilet Management</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © 2024 Smart Toilet Management System. Powered by IoT & AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;