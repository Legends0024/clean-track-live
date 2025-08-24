import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { 
  BarChart3, 
  Building, 
  Shield, 
  TrendingUp, 
  Calendar,
  FileText,
  PieChart,
  Globe,
  Users,
  Activity
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchTasks } from '../../features/tasks/tasksSlice';

import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardCard from '../../components/cards/DashboardCard';
import { Button } from '../../components/ui/Button';

const NHAIDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { connected, hygieneData } = useSocket();
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks(undefined));
  }, [dispatch]);

  // Calculate high-level metrics
  const totalFacilities = 25; // Mock data
  const systemHealth = Math.round(Math.random() * 20 + 80); // 80-100%
  const monthlyCleanings = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    const currentMonth = new Date().getMonth();
    return taskDate.getMonth() === currentMonth && task.status === 'completed';
  }).length;
  const efficiencyScore = Math.round((monthlyCleanings / Math.max(tasks.length, 1)) * 100);

  const navigationItems = [
    { name: 'Overview', href: '/nhai', icon: BarChart3 },
    { name: 'Analytics', href: '/nhai/analytics', icon: PieChart },
    { name: 'Reports', href: '/nhai/reports', icon: FileText },
    { name: 'System Health', href: '/nhai/health', icon: Shield },
  ];

  const dashboardCards = [
    {
      title: 'Total Facilities',
      value: totalFacilities,
      icon: <Building className="h-6 w-6" />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'System Health',
      value: `${systemHealth}%`,
      icon: <Shield className="h-6 w-6" />,
      trend: { value: 2, isPositive: true },
    },
    {
      title: 'Monthly Cleanings',
      value: monthlyCleanings,
      icon: <Calendar className="h-6 w-6" />,
      trend: { value: 15, isPositive: true },
    },
    {
      title: 'Efficiency Score',
      value: `${efficiencyScore}%`,
      icon: <TrendingUp className="h-6 w-6" />,
      trend: { value: 5, isPositive: true },
    },
  ];

  return (
    <DashboardLayout
      user={user}
      navigationItems={navigationItems}
      onLogout={logout}
      title="NHAI Dashboard"
      subtitle={`National oversight of ${totalFacilities} facilities with ${systemHealth}% system health`}
      connectionStatus={connected}
    >
      <Routes>
        <Route
          path="/"
          element={
            <div className="space-y-8">
              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DashboardCard {...card} />
                  </motion.div>
                ))}
              </div>

              {/* System Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Regional Performance */}
                <div className="card-glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      Regional Performance
                    </h2>
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { region: 'North Zone', facilities: 8, score: 92 },
                      { region: 'South Zone', facilities: 6, score: 88 },
                      { region: 'East Zone', facilities: 5, score: 85 },
                      { region: 'West Zone', facilities: 6, score: 90 },
                    ].map((zone, index) => (
                      <div key={zone.region} className="flex items-center justify-between p-3 bg-accent/5 rounded-xl">
                        <div>
                          <p className="font-medium text-foreground">{zone.region}</p>
                          <p className="text-sm text-muted-foreground">
                            {zone.facilities} facilities
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            zone.score >= 90 ? 'text-accent-success' : 
                            zone.score >= 80 ? 'text-accent-warning' : 'text-accent-danger'
                          }`}>
                            {zone.score}%
                          </p>
                          <p className="text-xs text-muted-foreground">Avg Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="card-glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      System Activities
                    </h2>
                    <Activity className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { type: 'Maintenance', location: 'Highway NH-1', time: '2 hours ago', status: 'completed' },
                      { type: 'Inspection', location: 'Block A-45', time: '4 hours ago', status: 'in-progress' },
                      { type: 'Alert', location: 'Block B-12', time: '6 hours ago', status: 'pending' },
                      { type: 'Report', location: 'Zone South', time: '1 day ago', status: 'completed' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-accent/5 rounded-xl">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === 'completed' ? 'bg-accent-success' :
                          activity.status === 'in-progress' ? 'bg-accent-secondary' :
                          'bg-accent-warning'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {activity.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.location} • {activity.time}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          activity.status === 'completed' ? 'bg-accent-success/10 text-accent-success' :
                          activity.status === 'in-progress' ? 'bg-accent-secondary/10 text-accent-secondary' :
                          'bg-accent-warning/10 text-accent-warning'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions & Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Quick Actions */}
                <div className="card-glass rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <Button variant="primary" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Monthly Report
                    </Button>
                    <Button variant="secondary" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      View Staff Performance
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      System Health Check
                    </Button>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="lg:col-span-2 card-glass rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Key Performance Indicators
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-accent/5 rounded-xl">
                      <p className="text-2xl font-bold text-foreground">98.5%</p>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                    <div className="text-center p-4 bg-accent/5 rounded-xl">
                      <p className="text-2xl font-bold text-foreground">4.8</p>
                      <p className="text-sm text-muted-foreground">Avg Rating</p>
                    </div>
                    <div className="text-center p-4 bg-accent/5 rounded-xl">
                      <p className="text-2xl font-bold text-foreground">156</p>
                      <p className="text-sm text-muted-foreground">Staff Active</p>
                    </div>
                    <div className="text-center p-4 bg-accent/5 rounded-xl">
                      <p className="text-2xl font-bold text-foreground">2.3M</p>
                      <p className="text-sm text-muted-foreground">Users/Month</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          }
        />

        <Route
          path="/analytics"
          element={
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Analytics</h2>
              <div className="card-glass rounded-2xl p-6">
                <p className="text-muted-foreground">Advanced analytics and insights will be displayed here.</p>
              </div>
            </div>
          }
        />

        <Route
          path="/reports"
          element={
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Reports</h2>
              <div className="card-glass rounded-2xl p-6">
                <p className="text-muted-foreground">Comprehensive reports and documentation will be displayed here.</p>
              </div>
            </div>
          }
        />

        <Route
          path="/health"
          element={
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">System Health</h2>
              <div className="card-glass rounded-2xl p-6">
                <p className="text-muted-foreground">System health monitoring and diagnostics will be displayed here.</p>
              </div>
            </div>
          }
        />
      </Routes>
    </DashboardLayout>
  );
};

export default NHAIDashboard;