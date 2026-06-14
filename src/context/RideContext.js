import React, { createContext, useState, useEffect, useContext } from 'react';
import socketService from '../services/socketService';
import { rideAPI } from '../services/api';
import { AuthContext } from './AuthContext';

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [activeRide, setActiveRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [incomingRideRequest, setIncomingRideRequest] = useState(null);
  const [rideMessages, setRideMessages] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      socketService.removeAllListeners();
      socketService.disconnect();
      return;
    }

    // Connect to socket
    socketService.connect();

    // Listen for ride events
    socketService.onRideRequest((ride) => {
      setIncomingRideRequest(ride);
    });

    socketService.onRideAccepted((ride) => {
      setActiveRide(ride);
    });

    socketService.onRideStarted((ride) => {
      setActiveRide(ride);
    });

    socketService.onRideCompleted((ride) => {
      setActiveRide(null);
      setRideHistory((prev) => [ride, ...prev]);
    });

    socketService.onRideCancelled((ride) => {
      setActiveRide(null);
      setIncomingRideRequest(null);
    });

    socketService.onChatMessage((message) => {
      if (!message?.rideId) return;
      setRideMessages((prev) => ({
        ...prev,
        [message.rideId]: [...(prev[message.rideId] || []), message],
      }));
    });

    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  const createRide = async (rideData) => {
    setLoading(true);
    try {
      // In real app, call API
      // const ride = await rideAPI.createRide(rideData);
      
      // Mock ride
      const ride = {
        id: Date.now().toString(),
        ...rideData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setActiveRide(ride);
      socketService.requestRide(ride);

      // MVP fallback flow: simulate driver assignment without backend
      setTimeout(() => {
        setActiveRide((current) => {
          if (!current || current.id !== ride.id || current.status !== 'pending') {
            return current;
          }

          return {
            ...current,
            status: 'accepted',
            driver: {
              id: 'driver-1',
              name: 'Vura Driver',
              rating: 4.9,
              vehicle: 'Toyota Corolla',
              plate: 'CA 123-456',
            },
            acceptedAt: new Date().toISOString(),
          };
        });
      }, 3000);
      
      return ride;
    } catch (error) {
      console.error('Error creating ride:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const acceptRide = async () => {
    if (!incomingRideRequest) return;

    try {
      // In real app, call API
      // await rideAPI.acceptRide(incomingRideRequest.id);
      
      const acceptedRide = {
        ...incomingRideRequest,
        status: 'accepted',
        driver: {
          id: '1',
          name: 'John Doe',
          rating: 4.9,
          vehicle: 'Toyota Camry',
          plate: 'ABC 123',
        },
      };

      setActiveRide(acceptedRide);
      setIncomingRideRequest(null);
      socketService.acceptRide(acceptedRide.id);
    } catch (error) {
      console.error('Error accepting ride:', error);
      throw error;
    }
  };

  const startRide = async () => {
    if (!activeRide) return;

    try {
      const updatedRide = {
        ...activeRide,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
      };

      setActiveRide(updatedRide);
      socketService.startRide(updatedRide.id);
    } catch (error) {
      console.error('Error starting ride:', error);
      throw error;
    }
  };

  const completeRide = async () => {
    if (!activeRide) return;

    try {
      const completedRide = {
        ...activeRide,
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pickup: activeRide.pickupAddress || activeRide.pickup,
        destination: activeRide.destinationAddress || activeRide.destination,
        driver: activeRide.driver?.name || activeRide.driver || 'Vura Driver',
        completedAt: new Date().toISOString(),
      };

      setRideHistory((prev) => [completedRide, ...prev]);
      setActiveRide(null);
      socketService.completeRide(completedRide.id);
      
      return completedRide;
    } catch (error) {
      console.error('Error completing ride:', error);
      throw error;
    }
  };

  const cancelRide = async (reason = '') => {
    if (!activeRide) return;

    try {
      // In real app, call API
      // await rideAPI.cancelRide(activeRide.id);
      
      socketService.cancelRide(activeRide.id, reason);
      setActiveRide(null);
    } catch (error) {
      console.error('Error cancelling ride:', error);
      throw error;
    }
  };

  const rateRide = async (rideId, rating, comment = '') => {
    try {
      // In real app, call API
      // await rideAPI.rateRide(rideId, rating, comment);
      
      // Update ride in history
      setRideHistory((prev) =>
        prev.map((ride) =>
          ride.id === rideId ? { ...ride, rating, comment } : ride
        )
      );
    } catch (error) {
      console.error('Error rating ride:', error);
      throw error;
    }
  };

  const fetchRideHistory = async () => {
    setLoading(true);
    try {
      // In MVP mode we keep local history; API integration can replace this.
    } catch (error) {
      console.error('Error fetching ride history:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendRideMessage = async ({ rideId, senderType, senderName, text }) => {
    if (!rideId || !text?.trim()) return;

    const message = {
      id: Date.now().toString(),
      rideId,
      senderType,
      senderName,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setRideMessages((prev) => ({
      ...prev,
      [rideId]: [...(prev[rideId] || []), message],
    }));

    socketService.sendChatMessage(message);
    return message;
  };

  const getRideMessages = (rideId) => {
    return rideMessages[rideId] || [];
  };

  return (
    <RideContext.Provider
      value={{
        activeRide,
        rideHistory,
        incomingRideRequest,
        rideMessages,
        loading,
        createRide,
        acceptRide,
        startRide,
        completeRide,
        cancelRide,
        rateRide,
        fetchRideHistory,
        sendRideMessage,
        getRideMessages,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};
