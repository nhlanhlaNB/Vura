import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from '../components/MapComponents';
import { Ionicons } from '@expo/vector-icons';
import { RideContext } from '../context/RideContext';

const { width, height } = Dimensions.get('window');

export default function RideTrackingScreen({ navigation }) {
  const { activeRide, completeRide } = useContext(RideContext);
  const [rideStatus, setRideStatus] = useState('searching'); // searching, driver_assigned, arriving

  useEffect(() => {
    if (activeRide?.status === 'accepted') {
      setRideStatus('driver_assigned');
    } else if (activeRide?.status === 'in_progress') {
      setRideStatus('arriving');
    } else if (!activeRide) {
      setRideStatus('searching');
    }
  }, [activeRide]);

  const renderStatusCard = () => {
    switch (rideStatus) {
      case 'searching':
        return (
          <View style={styles.statusCard}>
            <View style={styles.loadingContainer}>
              <View style={styles.spinner} />
              <Text style={styles.statusTitle}>Finding a driver...</Text>
              <Text style={styles.statusSubtext}>This usually takes a few moments</Text>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel Ride</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'driver_assigned':
        return (
          <View style={styles.statusCard}>
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{activeRide?.driver?.name || 'Vura Driver'}</Text>
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{activeRide?.driver?.rating || '4.9'}</Text>
                </View>
                <Text style={styles.carInfo}>
                  {activeRide?.driver?.vehicle || 'Toyota Corolla'} • {activeRide?.driver?.plate || 'CA 123-456'}
                </Text>
              </View>
              <View style={styles.driverActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="call" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('RideChat', { rideId: activeRide?.id })}
                >
                  <Ionicons name="chatbubble" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.arrivalInfo}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.arrivalText}>Driver arriving in 5 minutes</Text>
            </View>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={async () => {
                const ride = await completeRide();
                if (ride) {
                  navigation.replace('RideReceipt', { ride });
                }
              }}
            >
              <Text style={styles.completeButtonText}>Complete Demo Ride</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel Ride</Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Pickup"
          pinColor="green"
        />
        <Marker
          coordinate={{ latitude: 37.78925, longitude: -122.4424 }}
          title="Destination"
          pinColor="red"
        />
      </MapView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {renderStatusCard()}
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#f0f0f0',
    borderTopColor: '#000',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#666',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  carInfo: {
    fontSize: 14,
    color: '#666',
  },
  driverActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrivalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  arrivalText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff3b30',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
