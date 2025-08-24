import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;

  connect(token?: string): Socket {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      upgrade: true,
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, reconnect manually
        this.handleReconnection();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.handleReconnection();
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Socket reconnection error:', error);
    });
  }

  private handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
      }
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Event subscription methods
  onHygieneTick(callback: (data: SocketEvents['hygiene_tick']) => void) {
    this.socket?.on('hygiene_tick', callback);
  }

  onAlertCreated(callback: (data: SocketEvents['alert_created']) => void) {
    this.socket?.on('alert_created', callback);
  }

  onTaskUpdated(callback: (data: SocketEvents['task_updated']) => void) {
    this.socket?.on('task_updated', callback);
  }

  onBlockStatusChanged(callback: (data: SocketEvents['block_status_changed']) => void) {
    this.socket?.on('block_status_changed', callback);
  }

  // Event emission methods
  joinRoom(room: string) {
    this.socket?.emit('join_room', room);
  }

  leaveRoom(room: string) {
    this.socket?.emit('leave_room', room);
  }

  updateTaskStatus(taskId: string, status: string) {
    this.socket?.emit('task_status_update', { taskId, status });
  }

  acknowledgeAlert(alertId: string) {
    this.socket?.emit('acknowledge_alert', { alertId });
  }

  // Cleanup method
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }

  // Getter methods
  get connected(): boolean {
    return this.socket?.connected || false;
  }

  get id(): string | undefined {
    return this.socket?.id;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;