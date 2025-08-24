import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store/store';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  Image as ImageIcon,
  Activity,
} from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import ImageUpload from '@/components/ui/ImageUpload';
import { useAuth } from '@/hooks/useAuth';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  'in-progress': 'bg-blue-500/10 text-blue-500',
  completed: 'bg-green-500/10 text-green-500',
  overdue: 'bg-red-500/10 text-red-500',
};

const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { user } = useAuth();
  const task = useAppSelector((state) =>
    state.tasks.tasks.find((t) => t.id === taskId)
  );

  if (!task) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">Task not found</h1>
      </div>
    );
  }

  const handleImageUpload = (image: string) => {
    // TODO: Implement image upload
    console.log('Uploading image:', image);
  };

  const handleStatusUpdate = () => {
    // TODO: Implement status update
    console.log('Updating status...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container max-w-4xl py-8"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Details</h1>
          <p className="text-muted-foreground">View and manage task information</p>
        </div>
        {user?.role === 'cleaner' && task.status !== 'completed' && (
          <Button
            onClick={handleStatusUpdate}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark as Completed
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Task Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge
                  variant="secondary"
                  className={statusColors[task.status as keyof typeof statusColors]}
                >
                  {task.status}
                </Badge>
                <Badge variant="outline">{task.priority}</Badge>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Assigned to: {task.assignedTo}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {format(new Date(task.dueDate), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Start Time: {format(new Date(task.startTime), 'p')}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{task.description}</p>
              </div>
            </div>
          </Card>

          {(user?.role === 'cleaner' || user?.role === 'supervisor') && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Task Images</h2>
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>

              <ImageUpload
                onImageUpload={handleImageUpload}
                maxFiles={5}
                accept="image/*"
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                {task.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Task image ${index + 1}`}
                    className="rounded-lg object-cover aspect-video"
                  />
                ))}
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Activity Log</h2>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {task.activityLog?.map((activity, index) => (
                  <div
                    key={index}
                    className="text-sm border-l-2 border-muted pl-4 pb-4"
                  >
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-muted-foreground">
                      by {activity.user} on{' '}
                      {format(new Date(activity.timestamp), 'PPp')}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskDetailsPage;
