import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/store/store';
import { useAuth } from '@/hooks/useAuth';

interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  status: 'pending' | 'completed' | 'overdue';
}

const mockSchedule: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Clean Rest Area A',
    time: '09:00 AM',
    location: 'Highway 101, Mile 42',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Maintenance Check',
    time: '11:30 AM',
    location: 'Service Station B',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Urgent Cleaning',
    time: '02:00 PM',
    location: 'Rest Stop C',
    status: 'overdue',
  },
];

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  completed: 'bg-green-500/10 text-green-500',
  overdue: 'bg-red-500/10 text-red-500',
};

const statusIcons = {
  pending: Clock,
  completed: CheckCircle,
  overdue: AlertCircle,
};

const SchedulePage: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { user } = useAuth();

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    // TODO: Fetch schedule for the selected date
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <p className="text-muted-foreground">View and manage your daily tasks</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card className="p-4">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Schedule for {date ? format(date, 'MMMM d, yyyy') : 'Today'}
            </h2>

            <div className="space-y-4">
              {mockSchedule.map((event) => {
                const StatusIcon = statusIcons[event.status];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <StatusIcon className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium truncate">{event.title}</h3>
                        <Badge
                          variant="secondary"
                          className={statusColors[event.status]}
                        >
                          {event.status}
                        </Badge>
                      </div>

                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SchedulePage;
