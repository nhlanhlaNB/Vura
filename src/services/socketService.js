import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL } from '@env';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  async connect() {
    try {
      const socketUrl = SOCKET_URL?.trim();

      if (!socketUrl) {
        console.warn('SOCKET_URL is not set. Skipping socket connection.');
        return null;
      }

      const token = await AsyncStorage.getItem('authToken');
      
      this.socket = io(socketUrl, {
        auth: {
          token,
        },
        transports: ['websocket'],
        reconnection: false,
        timeout: 5000,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      this.socket.on('connect_error', (error) => {
        console.warn('Socket connect error:', error?.message || error);
      });

      return this.socket;
    } catch (error) {
      console.error('Error connecting socket:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from listeners map
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          this.socket.off(event, callback);
        });
      });
      this.listeners.clear();
    }
  }

  // Ride specific events
  requestRide(rideData) {
    this.emit('ride:request', rideData);
  }

  acceptRide(rideId) {
    this.emit('ride:accept', { rideId });
  }

  updateLocation(location) {
    this.emit('location:update', location);
  }

  startRide(rideId) {
    this.emit('ride:start', { rideId });
  }

  completeRide(rideId) {
    this.emit('ride:complete', { rideId });
  }

  cancelRide(rideId, reason) {
    this.emit('ride:cancel', { rideId, reason });
  }

  // Listen for ride events
  onRideRequest(callback) {
    this.on('ride:request', callback);
  }

  onRideAccepted(callback) {
    this.on('ride:accepted', callback);
  }

  onRideStarted(callback) {
    this.on('ride:started', callback);
  }

  onRideCompleted(callback) {
    this.on('ride:completed', callback);
  }

  onRideCancelled(callback) {
    this.on('ride:cancelled', callback);
  }

  onDriverLocationUpdate(callback) {
    this.on('driver:location', callback);
  }

  sendChatMessage(message) {
    this.emit('chat:message', message);
  }

  onChatMessage(callback) {
    this.on('chat:message', callback);
  }
}

export default new SocketService();
