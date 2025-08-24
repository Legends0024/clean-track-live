import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  Users, 
  Clock,
  CheckCircle2,
  MapPin,
  Monitor,
  FileText,
  TrendingUp
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchTasks } from '../../features/tasks/tasksSlice';

import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardCard from '../../components/cards/DashboardCard';
import { Button } from '../../components/ui/Button';

const SupervisorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { connected, hygieneData, alerts } = useSocket();
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Calculate metrics
  const activeBlocks = hygieneData.length;
  const pendingAlerts = alerts.filter(alert => !alert.acknowledged).length;
  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(task => task.status === 'completed').length / tasks.length) * 100)
    : 0;
  const averageHygiene = hygieneData.length > 0
    ? Math.round(hygieneData.reduce((sum, data) => sum + data.score, 0) / hygieneData.length)
    : 0;

  const navigationItems = [
    { name: 'Dashboard', href: '/supervisor', icon: BarChart3 },
    { name: 'Live Monitor', href: '/supervisor/monitoring', icon: Monitor },
    { name: 'Task Management', href: '/supervisor/tasks', icon: CheckCircle2 },
    { name: 'Reports', href: '/supervisor/reports', icon: FileText },
  ];

  const dashboardCards = [
    {
      title: 'Active Blocks',
      value: activeBlocks,
      icon: <MapPin className="h-6 w-6" />,
      trend: { value: 5, isPositive: true },
    },
    {
      title: 'Pending Alerts',
      value: pendingAlerts,
      icon: <AlertTriangle className="h-6 w-6" />,
      trend: { value: 12, isPositive: false },
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: <TrendingUp className="h-6 w-6" />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Average Hygiene',
      value: averageHygiene,
      icon: <Activity className="h-6 w-6" />,
      trend: { value: 3, isPositive: true },
    },
  ];

  return (
    <DashboardLayout
      user={user}
      navigationItems={navigationItems}
      onLogout={logout}
      title="Supervisor Dashboard"
      subtitle={`Monitoring ${activeBlocks} blocks with ${pendingAlerts} pending alerts`}
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

              {/* Real-time Monitoring */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Live Hygiene Scores */}
                <div className="card-glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      Live Hygiene Scores
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent-success rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {hygieneData.slice(0, 5).map((data, index) => (
                      <div key={`${data.blockId}-${index}`} className="flex items-center justify-between p-3 bg-accent/5 rounded-xl">
                        <div>
                          <p className="font-medium text-foreground">Block {data.blockId}</p>
                          <p className="text-sm text-muted-foreground">
                            Updated {new Date(data.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            data.score >= 80 ? 'text-accent-success' : 
                            data.score >= 60 ? 'text-accent-warning' : 'text-accent-danger'
                          }`}>
                            {data.score}
                          </p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {hygieneData.length === 0 && (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No live data available</p>
                    </div>
                  )}
                </div>

                {/* Recent Alerts */}
                <div className="card-glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      Recent Alerts
                    </h2>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {alerts.slice(0, 5).map((alert, index) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 bg-accent/5 rounded-xl">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.level === 'critical' ? 'bg-accent-danger' :
                          alert.level === 'high' ? 'bg-accent-warning' :
                          'bg-accent-secondary'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                          </p>
                          <p className="text-xs text-muted-foreground truncate mb-1">
                            Block {alert.blockId} • {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {!alert.acknowledged && (
                          <Button variant="ghost" size="sm" className="text-xs">
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {alerts.length === 0 && (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No alerts</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card-glass rounded-2xl p-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="primary" className="h-12">
                    <Users className="h-4 w-4 mr-2" />
                    Assign Tasks
                  </Button>
                  <Button variant="secondary" className="h-12">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="h-12">
                    <Monitor className="h-4 w-4 mr-2" />
                    System Status
                  </Button>
                </div>
              </motion.div>
            </div>
          }
        />

        <Route
          path="/monitoring"
          element={
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Live Monitoring</h2>
              <div className="card-glass rounded-2xl p-6">
                <p className="text-muted-foreground">Real-time monitoring interface will be displayed here.</p>
              </div>
            </div>
          }
        />

        <Route
          path="/tasks"
          element={
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Task Management</h2>
              <div className="card-glass rounded-2xl p-6">
                <p className="text-muted-foreground">Task management interface will be displayed here.</p>
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
                <p className="text-muted-foreground">Reports and analytics will be displayed here.</p>
              </div>
            </div>
          }
        />
      </Routes>
    </DashboardLayout>
  );
};

export default SupervisorDashboard;