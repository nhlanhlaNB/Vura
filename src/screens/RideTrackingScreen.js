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
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        zoomEnabled
        scrollEnabled
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

      {/* Back Button - Top Left */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Drag Handle */}
      <View style={styles.dragHandleContainer}>
        <View style={styles.dragHandle} />
      </View>

      {/* Status Card - Bottom Sheet */}
      {renderStatusCard()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10,
  },
  dragHandleContainer: {
    position: 'absolute',
    bottom: 'auto',
    bottom: height * 0.35,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 8,
    zIndex: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  statusCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: height * 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 25,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#e0e0e0',
    borderTopColor: '#E50000',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  driverAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E50000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  carInfo: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  arrivalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc400',
  },
  arrivalText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    flex: 1,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E50000',
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#E50000',
    fontSize: 16,
    fontWeight: '700',
  },
  completeButton: {
    backgroundColor: '#E50000',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#E50000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
