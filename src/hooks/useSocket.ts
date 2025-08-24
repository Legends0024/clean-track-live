import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/store';
import { socketService } from '../services/socket';
import { updateTaskFromSocket } from '../features/tasks/tasksSlice';
import { SocketEvents, HygieneScore, Alert } from '../types';

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
  const [connected, setConnected] = useState(false);
  const [hygieneData, setHygieneData] = useState<HygieneScore[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const socketRef = useRef(socketService);

  // Connect socket when authenticated
  useEffect(() => {
    if (isAuthenticated && token && user) {
      const socket = socketRef.current.connect(token);
      
      // Setup connection status tracking
      const handleConnect = () => {
        setConnected(true);
        
        // Join user-specific room based on role
        if (user.role === 'cleaner' && user.blockId) {
          socketRef.current.joinRoom(`block:${user.blockId}`);
        } else if (user.role === 'supervisor') {
          socketRef.current.joinRoom('supervisors');
        } else if (user.role === 'nhai') {
          socketRef.current.joinRoom('nhai');
        }
      };

      const handleDisconnect = () => {
        setConnected(false);
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);

      // Setup event listeners
      setupEventListeners();

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socketRef.current.removeAllListeners();
      };
    } else {
      // Disconnect if not authenticated
      socketRef.current.disconnect();
      setConnected(false);
    }
  }, [isAuthenticated, token, user, dispatch]);

  const setupEventListeners = () => {
    // Hygiene score updates
    socketRef.current.onHygieneTick((data: SocketEvents['hygiene_tick']) => {
      setHygieneData((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(item => item.blockId === data.blockId);
        
        if (existingIndex !== -1) {
          updated[existingIndex] = data;
        } else {
          updated.push(data);
        }
        
        // Keep only last 50 entries per block
        return updated.slice(-50);
      });
    });

    // Alert creation
    socketRef.current.onAlertCreated((data: SocketEvents['alert_created']) => {
      setAlerts((prev) => [data, ...prev.slice(0, 49)]); // Keep last 50 alerts
      
      // Show notification based on user role
      if (user?.role === 'supervisor' || user?.role === 'nhai') {
        showNotification(data);
      }
    });

    // Task updates
    socketRef.current.onTaskUpdated((data: SocketEvents['task_updated']) => {
      dispatch(updateTaskFromSocket(data));
    });
  };

  const showNotification = (alert: Alert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${alert.type.toUpperCase()} Alert`, {
        body: alert.message,
        icon: '/favicon.ico',
        tag: alert.id,
      });
    }
  };

  // Socket action methods
  const joinRoom = (room: string) => {
    socketRef.current.joinRoom(room);
  };

  const leaveRoom = (room: string) => {
    socketRef.current.leaveRoom(room);
  };

  const updateTaskStatus = (taskId: string, status: string) => {
    socketRef.current.updateTaskStatus(taskId, status);
  };

  const acknowledgeAlert = (alertId: string) => {
    socketRef.current.acknowledgeAlert(alertId);
    
    // Update local alerts state
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Simulate real-time data for demo purposes
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const interval = setInterval(() => {
      // Simulate hygiene data
      const mockHygieneData: HygieneScore = {
        blockId: user.blockId || 'block-1',
        score: Math.floor(Math.random() * 40) + 60, // 60-100 range
        timestamp: new Date().toISOString(),
        sensors: {
          cleanliness: Math.floor(Math.random() * 40) + 60,
          odor: Math.floor(Math.random() * 40) + 60,
          usage: Math.floor(Math.random() * 40) + 60,
          maintenance: Math.floor(Math.random() * 40) + 60,
        },
      };

      setHygieneData((prev) => [...prev.slice(-49), mockHygieneData]);

      // Occasionally generate alerts for demo
      if (Math.random() < 0.1) { // 10% chance
        const mockAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: ['maintenance', 'cleanliness', 'usage'][Math.floor(Math.random() * 3)] as any,
          blockId: user.blockId || 'block-1',
          level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          message: 'System detected anomaly requiring attention',
          timestamp: new Date().toISOString(),
          acknowledged: false,
        };

        setAlerts((prev) => [mockAlert, ...prev.slice(0, 49)]);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  return {
    connected,
    hygieneData,
    alerts,
    joinRoom,
    leaveRoom,
    updateTaskStatus,
    acknowledgeAlert,
    socketId: socketRef.current.id,
  };
};
