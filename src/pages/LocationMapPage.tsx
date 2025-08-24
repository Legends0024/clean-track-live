import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  User,
  Check,
  AlertTriangle,
  Clock,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Location {
  id: string;
  name: string;
  type: 'restArea' | 'serviceStation' | 'plaza';
  status: 'clean' | 'needsAttention' | 'inProgress';
  coordinates: { lat: number; lng: number };
  assignedTo?: string;
  lastCleaned?: string;
  nextScheduled?: string;
}

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Rest Area A',
    type: 'restArea',
    status: 'clean',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    assignedTo: 'John Smith',
    lastCleaned: '2 hours ago',
    nextScheduled: 'in 4 hours',
  },
  {
    id: '2',
    name: 'Service Station B',
    type: 'serviceStation',
    status: 'needsAttention',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    assignedTo: 'Sarah Johnson',
    lastCleaned: '6 hours ago',
    nextScheduled: 'in 1 hour',
  },
  {
    id: '3',
    name: 'Highway Plaza C',
    type: 'plaza',
    status: 'inProgress',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    assignedTo: 'Mike Wilson',
    lastCleaned: '1 day ago',
    nextScheduled: 'in progress',
  },
];

const statusColors = {
  clean: 'bg-green-500/10 text-green-500',
  needsAttention: 'bg-red-500/10 text-red-500',
  inProgress: 'bg-yellow-500/10 text-yellow-500',
};

const statusIcons = {
  clean: Check,
  needsAttention: AlertTriangle,
  inProgress: Clock,
};

const LocationMapPage: React.FC = () => {
  const [selectedType, setSelectedType] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');

  const filteredLocations = mockLocations.filter(
    (location) =>
      (selectedType === 'all' || location.type === selectedType) &&
      (selectedStatus === 'all' || location.status === selectedStatus)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Location Map</h1>
        <p className="text-muted-foreground">Monitor facility locations and status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card className="p-6">
          {/* Map placeholder - Replace with actual map implementation */}
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Map View</p>
            {/* TODO: Implement map using Google Maps or similar */}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Filter by Type
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="restArea">Rest Areas</SelectItem>
                    <SelectItem value="serviceStation">Service Stations</SelectItem>
                    <SelectItem value="plaza">Plazas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Filter by Status
                </label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="clean">Clean</SelectItem>
                    <SelectItem value="needsAttention">Needs Attention</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {filteredLocations.map((location) => {
              const StatusIcon = statusIcons[location.status];
              return (
                <Card key={location.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {location.type.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={statusColors[location.status]}
                    >
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {location.status}
                    </Badge>
                  </div>

                  {location.assignedTo && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <User className="h-4 w-4" />
                      {location.assignedTo}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4" />
                    Last cleaned: {location.lastCleaned}
                  </div>

                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationMapPage;
