import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Switch,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from '../../components/MapComponents';
import { Ionicons } from '@expo/vector-icons';
import { LocationContext } from '../../context/LocationContext';
import { RideContext } from '../../context/RideContext';

const { width, height } = Dimensions.get('window');

export default function DriverHomeScreen({ navigation }) {
  const { currentLocation, getCurrentLocation } = useContext(LocationContext);
  const { activeRide, acceptRide } = useContext(RideContext);
  const [isOnline, setIsOnline] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(false);

  useEffect(() => {
    getCurrentLocation().catch(() => null);
  }, [getCurrentLocation]);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      // Start listening for ride requests
      setTimeout(() => setShowRideRequest(true), 3000);
    }
  };

  const handleAcceptRide = () => {
    acceptRide();
    setShowRideRequest(false);
    // Navigate to active ride screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: currentLocation?.latitude || 37.78825,
          longitude: currentLocation?.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
          >
            <View style={styles.driverMarker}>
              <Ionicons name="car" size={24} color="#fff" />
            </View>
          </Marker>
        )}
      </MapView>

      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>
            {isOnline ? 'You\'re Online' : 'You\'re Offline'}
          </Text>
          <Switch
            value={isOnline}
            onValueChange={toggleOnline}
            trackColor={{ false: '#ccc', true: '#4caf50' }}
            thumbColor={isOnline ? '#fff' : '#f4f3f4'}
          />
        </View>
        {isOnline && (
          <Text style={styles.statusSubtext}>
            Waiting for ride requests...
          </Text>
        )}
      </View>

      {showRideRequest && isOnline && (
        <View style={styles.rideRequestCard}>
          <View style={styles.rideRequestHeader}>
            <Text style={styles.rideRequestTitle}>New Ride Request</Text>
            <Text style={styles.rideRequestPrice}>R85.50</Text>
          </View>

          <View style={styles.rideRequestDetails}>
            <View style={styles.locationRow}>
              <Ionicons name="radio-button-on" size={16} color="green" />
              <Text style={styles.locationText}>123 Main St</Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="red" />
              <Text style={styles.locationText}>456 Park Ave</Text>
            </View>
          </View>

          <View style={styles.rideRequestInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.infoText}>5 min away</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="navigate-outline" size={18} color="#666" />
              <Text style={styles.infoText}>8.2 km</Text>
            </View>
          </View>

          <View style={styles.rideRequestActions}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => setShowRideRequest(false)}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAcceptRide}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {activeRide && (
        <TouchableOpacity
          style={styles.chatPassengerButton}
          onPress={() => navigation.navigate('RideChat', { rideId: activeRide.id })}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
          <Text style={styles.chatPassengerButtonText}>Chat Passenger</Text>
        </TouchableOpacity>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Trips Today</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>R1,320</Text>
          <Text style={styles.statLabel}>Earned Today</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  driverMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  statusCard: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  rideRequestCard: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rideRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rideRequestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rideRequestPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  rideRequestDetails: {
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationDivider: {
    width: 1,
    height: 15,
    backgroundColor: '#ddd',
    marginLeft: 7,
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  rideRequestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  rideRequestActions: {
    flexDirection: 'row',
    gap: 10,
  },
  declineButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatPassengerButton: {
    position: 'absolute',
    bottom: 155,
    right: 20,
    backgroundColor: '#000',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chatPassengerButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});
