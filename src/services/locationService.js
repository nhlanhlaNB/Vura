import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';

class LocationService {
  constructor() {
    this.watchId = null;
  }

  async requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const permissionError = new Error('Location permission not granted');
        permissionError.code = 'LOCATION_PERMISSION_DENIED';
        throw permissionError;
      }
      return true;
    } catch (error) {
      if (error?.code !== 'LOCATION_PERMISSION_DENIED') {
        console.error('Error requesting location permissions:', error);
      }
      throw error;
    }
  }

  async getCurrentLocation() {
    try {
      await this.requestPermissions();
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      };
    } catch (error) {
      if (error?.code === 'LOCATION_PERMISSION_DENIED') {
        return null;
      }
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  async watchPosition(callback) {
    try {
      await this.requestPermissions();
      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
          });
        }
      );
      return this.watchId;
    } catch (error) {
      if (error?.code === 'LOCATION_PERMISSION_DENIED') {
        return null;
      }
      console.error('Error watching position:', error);
      throw error;
    }
  }

  stopWatchingPosition() {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
  }

  async reverseGeocode(latitude, longitude) {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (result.length > 0) {
        const address = result[0];
        return {
          name: address.name || '',
          street: address.street || '',
          city: address.city || '',
          region: address.region || '',
          country: address.country || '',
          postalCode: address.postalCode || '',
          formattedAddress: `${address.street || ''}, ${address.city || ''}, ${address.region || ''}`.trim(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }

  async geocode(address) {
    try {
      if (GOOGLE_MAPS_API_KEY) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results?.length > 0) {
          const location = data.results[0].geometry.location;
          return {
            latitude: location.lat,
            longitude: location.lng,
            formattedAddress: data.results[0].formatted_address,
          };
        }
      }

      const fallbackResult = await Location.geocodeAsync(address);
      if (fallbackResult.length > 0) {
        return {
          latitude: fallbackResult[0].latitude,
          longitude: fallbackResult[0].longitude,
          formattedAddress: address,
        };
      }

      return null;
    } catch (error) {
      console.error('Error geocoding:', error);
      throw error;
    }
  }

  async searchPlaces(query) {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      if (!GOOGLE_MAPS_API_KEY) {
        return [];
      }

      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query
      )}&key=${GOOGLE_MAPS_API_KEY}&components=country:za`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        return [];
      }

      return (data.predictions || []).map((item) => ({
        id: item.place_id,
        placeId: item.place_id,
        name: item.structured_formatting?.main_text || item.description,
        address: item.description,
      }));
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId) {
    try {
      if (!placeId || !GOOGLE_MAPS_API_KEY) {
        return null;
      }

      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        placeId
      )}&fields=name,formatted_address,geometry&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || !data.result) {
        return null;
      }

      return {
        id: placeId,
        name: data.result.name,
        address: data.result.formatted_address,
        coords: {
          latitude: data.result.geometry.location.lat,
          longitude: data.result.geometry.location.lng,
        },
      };
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}

export default new LocationService();
