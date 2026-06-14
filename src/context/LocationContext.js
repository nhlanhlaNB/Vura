import React, { createContext, useState, useEffect } from 'react';
import locationService from '../services/locationService';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop watching position when component unmounts
      if (watchId) {
        locationService.stopWatchingPosition();
      }
    };
  }, [watchId]);

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const location = await locationService.getCurrentLocation();
      if (!location) {
        setError('Location access is disabled. Enable permissions to use live location.');
        return null;
      }
      setCurrentLocation(location);
      return location;
    } catch (err) {
      setError(err.message);
      console.error('Error getting location:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const startWatchingLocation = async () => {
    try {
      const id = await locationService.watchPosition((location) => {
        setCurrentLocation(location);
      });
      if (!id) {
        setError('Location tracking is unavailable because permission is denied.');
        return;
      }
      setWatchId(id);
    } catch (err) {
      setError(err.message);
      console.error('Error watching location:', err);
    }
  };

  const stopWatchingLocation = () => {
    locationService.stopWatchingPosition();
    setWatchId(null);
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      return await locationService.reverseGeocode(latitude, longitude);
    } catch (err) {
      console.error('Error reverse geocoding:', err);
      throw err;
    }
  };

  const geocode = async (address) => {
    try {
      return await locationService.geocode(address);
    } catch (err) {
      console.error('Error geocoding:', err);
      throw err;
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    return locationService.calculateDistance(lat1, lon1, lat2, lon2);
  };

  const searchPlaces = async (query) => {
    return locationService.searchPlaces(query);
  };

  const getPlaceDetails = async (placeId) => {
    return locationService.getPlaceDetails(placeId);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        loading,
        error,
        getCurrentLocation,
        startWatchingLocation,
        stopWatchingLocation,
        reverseGeocode,
        geocode,
        calculateDistance,
        searchPlaces,
        getPlaceDetails,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
