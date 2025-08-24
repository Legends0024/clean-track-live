import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, AlertCircle, CheckCircle2, Camera } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Task } from '../../types';
import { formatDateTime, getPriorityColor, getStatusColor } from '../../utils/helpers';
import { Button } from '../ui/Button';

interface TaskCardProps {
  task: Task;
  onStart?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  onUpload?: (taskId: string) => void;
  onView?: (taskId: string) => void;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStart,
  onComplete,
  onUpload,
  onView,
  className,
}) => {
  const priorityStyle = getPriorityColor(task.priority);
  const statusStyle = getStatusColor(task.status);

  const getActionButton = () => {
    switch (task.status) {
      case 'pending':
        return onStart && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStart(task.id)}
            className="ml-auto"
          >
            Start Task
          </Button>
        );
      case 'in-progress':
        return (
          <div className="flex gap-2 ml-auto">
            {onUpload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpload(task.id)}
              >
                <Camera className="h-4 w-4 mr-1" />
                Upload
              </Button>
            )}
            {onComplete && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onComplete(task.id)}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2 ml-auto">
            {task.inspectionScore && (
              <div className="text-sm text-muted-foreground">
                Score: <span className="font-medium text-foreground">{task.inspectionScore}</span>
              </div>
            )}
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(task.id)}
              >
                View Details
              </Button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-accent-success" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-accent-secondary" />;
      case 'pending':
      default:
        return <AlertCircle className="h-4 w-4 text-accent-warning" />;
    }
  };

  return (
    <motion.div
      className={cn(
        'card-glass rounded-2xl p-6 transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.01]',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
            {task.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {getStatusIcon()}
          <div
            className={cn(
              'px-2 py-1 rounded-lg text-xs font-medium',
              statusStyle.color,
              statusStyle.bgColor
            )}
          >
            {task.status.replace('-', ' ')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>Block {task.blockId}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Due {formatDateTime(task.dueDate)}</span>
        </div>
        <div
          className={cn(
            'px-2 py-1 rounded-lg text-xs font-medium',
            priorityStyle.color,
            priorityStyle.bgColor
          )}
        >
          {task.priority} priority
        </div>
      </div>

      {task.imageUrl && (
        <div className="mb-4">
          <img
            src={task.imageUrl}
            alt="Task completion"
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      {task.inspectionLabel && (
        <div className="mb-4 p-3 bg-accent/10 rounded-lg">
          <p className="text-sm font-medium text-accent mb-1">AI Inspection Result:</p>
          <p className="text-sm text-muted-foreground">{task.inspectionLabel}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {task.completedAt ? (
            `Completed ${formatDateTime(task.completedAt)}`
          ) : (
            `Created ${formatDateTime(task.createdAt)}`
          )}
        </div>
        {getActionButton()}
      </div>
    </motion.div>
  );
};

export default TaskCard;