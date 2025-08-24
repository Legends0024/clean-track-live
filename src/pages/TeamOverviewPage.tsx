import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Activity,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  role: string;
  tasksCompleted: number;
  totalTasks: number;
  location: string;
  lastActive: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1234567890',
    status: 'online',
    role: 'Senior Cleaner',
    tasksCompleted: 15,
    totalTasks: 20,
    location: 'Highway 101, Mile 42',
    lastActive: '2 minutes ago',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1234567891',
    status: 'busy',
    role: 'Cleaner',
    tasksCompleted: 8,
    totalTasks: 10,
    location: 'Rest Stop A',
    lastActive: '15 minutes ago',
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.w@example.com',
    phone: '+1234567892',
    status: 'offline',
    role: 'Maintenance',
    tasksCompleted: 5,
    totalTasks: 12,
    location: 'Service Station B',
    lastActive: '1 hour ago',
  },
];

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  busy: 'bg-yellow-500',
};

const TeamOverviewPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  const filteredMembers = mockTeamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Team Overview</h1>
        <p className="text-muted-foreground">Monitor and manage your team's performance</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-lg bg-primary/10">
            <h3 className="font-medium text-primary mb-2">Total Members</h3>
            <p className="text-2xl font-bold">{mockTeamMembers.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10">
            <h3 className="font-medium text-green-500 mb-2">Online</h3>
            <p className="text-2xl font-bold">
              {mockTeamMembers.filter((m) => m.status === 'online').length}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-500/10">
            <h3 className="font-medium text-yellow-500 mb-2">Tasks in Progress</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/10">
            <h3 className="font-medium text-blue-500 mb-2">Completed Today</h3>
            <p className="text-2xl font-bold">28</p>
          </div>
        </div>
      </Card>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {member.avatar ? (
                      <AvatarImage src={member.avatar} alt={member.name} />
                    ) : (
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  statusColors[member.status],
                )} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {member.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {member.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last active: {member.lastActive}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tasks Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {member.tasksCompleted}/{member.totalTasks}
                  </span>
                </div>
                <Progress
                  value={(member.tasksCompleted / member.totalTasks) * 100}
                  className="h-2"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="w-full" size="sm">
                  View Details
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Message
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TeamOverviewPage;
