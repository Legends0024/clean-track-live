import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  Award, 
  Camera,
  Upload,
  BarChart3,
  User,
  LogOut,
  MapPin
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchTasks, updateTask, completeTask } from '../../features/tasks/tasksSlice';
import { useToast } from '../../hooks/use-toast';

import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardCard from '../../components/cards/DashboardCard';
import TaskCard from '../../components/cards/TaskCard';
import ImageUpload from '../../components/ui/ImageUpload';
import { Button } from '../../components/ui/Button';

const CleanerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { connected, hygieneData } = useSocket();
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const { toast } = useToast();
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Fetch user's tasks on component mount
  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.id));
    }
  }, [dispatch, user]);

  // Calculate dashboard metrics
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const completedToday = tasks.filter(task => {
    if (task.status !== 'completed' || !task.completedAt) return false;
    const today = new Date().toDateString();
    const completedDate = new Date(task.completedAt).toDateString();
    return today === completedDate;
  }).length;
  
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const averageScore = completedTasks.length > 0 
    ? Math.round(completedTasks.reduce((sum, task) => sum + (task.inspectionScore || 0), 0) / completedTasks.length)
    : 0;

  // Current hygiene score for user's block
  const currentBlockScore = user?.blockId 
    ? hygieneData.find(data => data.blockId === user.blockId)?.score || 0
    : 0;

  const handleStartTask = async (taskId: string) => {
    try {
      await dispatch(updateTask({ 
        id: taskId, 
        updates: { status: 'in-progress' } 
      })).unwrap();
      
      toast({
        title: "Task Started",
        description: "Task has been marked as in progress",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start task",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await dispatch(completeTask({ id: taskId })).unwrap();
      
      toast({
        title: "Task Completed",
        description: "Task has been marked as completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      });
    }
  };

  const handleUploadImage = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowUploadModal(true);
  };

  const handleImageUploaded = async (imageUrl: string, inspectionData?: any) => {
    if (!selectedTaskId) return;

    try {
      await dispatch(completeTask({ 
        id: selectedTaskId, 
        imageUrl,
        inspectionData 
      })).unwrap();
      
      setShowUploadModal(false);
      setSelectedTaskId(null);
      
      toast({
        title: "Task Completed",
        description: `Task completed with image. ${inspectionData ? `Score: ${inspectionData.score}` : ''}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task with image",
        variant: "destructive",
      });
    }
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/cleaner', icon: BarChart3 },
    { name: 'My Tasks', href: '/cleaner/tasks', icon: CheckSquare },
    { name: 'Profile', href: '/cleaner/profile', icon: User },
  ];

  const dashboardCards = [
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      icon: <Clock className="h-6 w-6" />,
      trend: { value: 12, isPositive: false },
    },
    {
      title: 'Completed Today',
      value: completedToday,
      icon: <CheckSquare className="h-6 w-6" />,
      trend: { value: 25, isPositive: true },
    },
    {
      title: 'Average Score',
      value: averageScore,
      icon: <Award className="h-6 w-6" />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Block Score',
      value: currentBlockScore,
      icon: <MapPin className="h-6 w-6" />,
      trend: { value: 5, isPositive: true },
    },
  ];

  return (
    <DashboardLayout
      user={user}
      navigationItems={navigationItems}
      onLogout={logout}
      title="Cleaner Dashboard"
      subtitle={`Welcome back, ${user?.name}! You have ${pendingTasks} pending tasks.`}
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

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-glass rounded-2xl p-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Quick Actions
                </h2>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" className="flex-1 min-w-fit">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button variant="secondary" className="flex-1 min-w-fit">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button variant="outline" className="flex-1 min-w-fit">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    View Tasks
                  </Button>
                </div>
              </motion.div>

              {/* Recent Tasks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Recent Tasks
                  </h2>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground mt-2">Loading tasks...</p>
                  </div>
                ) : tasks.length > 0 ? (
                  <div className="grid gap-6">
                    {tasks.slice(0, 3).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStart={handleStartTask}
                        onComplete={handleCompleteTask}
                        onUpload={handleUploadImage}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 card-glass rounded-2xl">
                    <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No tasks assigned yet</p>
                  </div>
                )}
              </motion.div>
            </div>
          }
        />
        
        <Route
          path="/tasks"
          element={
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">My Tasks</h2>
              {tasks.length > 0 ? (
                <div className="grid gap-6">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStart={handleStartTask}
                      onComplete={handleCompleteTask}
                      onUpload={handleUploadImage}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 card-glass rounded-2xl">
                  <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tasks available</p>
                </div>
              )}
            </div>
          }
        />
        
        <Route
          path="/profile"
          element={
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Profile</h2>
              <div className="card-glass rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{user?.name}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user?.role} • Block {user?.blockId || 'Not Assigned'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-foreground">{completedTasks.length}</p>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-bold text-foreground">{averageScore}</p>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </Routes>

      {/* Image Upload Modal */}
      {showUploadModal && (
        <ImageUpload
          onClose={() => {
            setShowUploadModal(false);
            setSelectedTaskId(null);
          }}
          onUpload={handleImageUploaded}
        />
      )}
    </DashboardLayout>
  );
};

export default CleanerDashboard;