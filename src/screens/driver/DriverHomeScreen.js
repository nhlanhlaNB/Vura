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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { LocationContext } from '../../context/LocationContext';
import { RideContext } from '../../context/RideContext';
import { colors, spacing, borderRadius, shadows, typography } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export default function DriverHomeScreen({ navigation }) {
  const { currentLocation, getCurrentLocation } = useContext(LocationContext);
  const { activeRide, acceptRide } = useContext(RideContext);
  const [isOnline, setIsOnline] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [totalEarnings] = useState(2840.50);
  const [ridesCompleted] = useState(18);

  useEffect(() => {
    getCurrentLocation().catch(() => null);
  }, [getCurrentLocation]);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      setTimeout(() => setShowRideRequest(true), 3000);
    }
  };

  const handleAcceptRide = () => {
    acceptRide();
    setShowRideRequest(false);
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
              <Ionicons name="car-sport" size={28} color={colors.white} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Status Card */}
      <Animatable.View
        animation="slideInDown"
        duration={600}
        style={styles.statusCardContainer}
      >
        <LinearGradient
          colors={isOnline ? colors.gradients.primary : ['#F5F5F5', '#EEEEEE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statusCard}
        >
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: isOnline ? colors.success : colors.offline },
                ]}
              />
              <View>
                <Text style={[styles.statusTitle, { color: isOnline ? colors.white : colors.black }]}>
                  {isOnline ? 'You\'re Online' : 'You\'re Offline'}
                </Text>
                <Text style={[styles.statusSubtext, { color: isOnline ? 'rgba(255,255,255,0.8)' : colors.textGray }]}>
                  {isOnline ? 'Ready for rides' : 'Go online to receive requests'}
                </Text>
              </View>
            </View>
            <Switch
              value={isOnline}
              onValueChange={toggleOnline}
              trackColor={{ false: '#ccc', true: 'rgba(255,255,255,0.3)' }}
              thumbColor={isOnline ? colors.white : '#f4f3f4'}
            />
          </View>
        </LinearGradient>
      </Animatable.View>

      {/* Stats Cards */}
      <Animatable.View animation="fadeIn" delay={200} duration={600} style={styles.statsContainer}>
        <LinearGradient
          colors={['#FF6B6B', '#FFB6D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCard}
        >
          <View style={styles.statContent}>
            <Ionicons name="cash" size={28} color={colors.white} />
            <View style={styles.statText}>
              <Text style={styles.statValue}>R{totalEarnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['#FFA500', '#FFD700']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCard}
        >
          <View style={styles.statContent}>
            <Ionicons name="checkmark-circle" size={28} color={colors.white} />
            <View style={styles.statText}>
              <Text style={styles.statValue}>{ridesCompleted}</Text>
              <Text style={styles.statLabel}>Rides</Text>
            </View>
          </View>
        </LinearGradient>
      </Animatable.View>

      {/* My Location Button */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={() => getCurrentLocation().catch(() => null)}
        activeOpacity={0.8}
      >
        <LinearGradient colors={colors.gradients.primary} style={styles.myLocationGradient}>
          <Ionicons name="locate" size={24} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Ride Request Modal */}
      {showRideRequest && isOnline && (
        <Animatable.View animation="slideInUp" duration={400} style={styles.rideRequestOverlay}>
          <LinearGradient
            colors={['#FF6B6B', '#FF1493']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rideRequestCard}
          >
            <View style={styles.rideRequestHeader}>
              <View>
                <Text style={styles.rideRequestLabel}>New Ride Request!</Text>
                <Text style={styles.rideRequestTime}>2 min away</Text>
              </View>
              <Text style={styles.rideRequestPrice}>R85.50</Text>
            </View>

            <View style={styles.rideRequestDetails}>
              <View style={styles.locationRow}>
                <View style={styles.locationDot}>
                  <Ionicons name="radio-button-on" size={12} color={colors.success} />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>Pickup</Text>
                  <Text style={styles.locationText}>123 Main Street</Text>
                </View>
              </View>

              <View style={styles.dividerLine} />

              <View style={styles.locationRow}>
                <View style={styles.locationDot}>
                  <Ionicons name="radio-button-on" size={12} color={colors.error} />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>Destination</Text>
                  <Text style={styles.locationText}>456 Park Avenue</Text>
                </View>
              </View>
            </View>

            <View style={styles.rideRequestActions}>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => setShowRideRequest(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAcceptRide}
                activeOpacity={0.8}
              >
                <Text style={styles.acceptButtonText}>Accept Ride</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animatable.View>
      )}

      {/* Quick Actions */}
      {!showRideRequest && (
        <Animatable.View
          animation="slideInUp"
          delay={300}
          duration={600}
          style={styles.quickActionsContainer}
        >
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Earnings')}
            activeOpacity={0.8}
          >
            <Ionicons name="stats-chart" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Ionicons name="person-circle" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Support')}
            activeOpacity={0.8}
          >
            <Ionicons name="help-circle" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  driverMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.lg,
  },
  statusCardContainer: {
    position: 'absolute',
    top: spacing[4],
    left: spacing[4],
    right: spacing[4],
    zIndex: 5,
  },
  statusCard: {
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    ...shadows.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    ...shadows.base,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: typography.bold,
  },
  statusSubtext: {
    fontSize: 12,
    fontWeight: typography.normal,
    marginTop: spacing[1],
  },
  statsContainer: {
    position: 'absolute',
    top: 140,
    left: spacing[4],
    right: spacing[4],
    zIndex: 5,
    gap: spacing[3],
  },
  statCard: {
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    ...shadows.lg,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: typography.bold,
    color: colors.white,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: typography.normal,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing[1],
  },
  myLocationButton: {
    position: 'absolute',
    bottom: spacing[6],
    right: spacing[4],
    zIndex: 8,
  },
  myLocationGradient: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  rideRequestOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  rideRequestCard: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
    paddingBottom: spacing[6],
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
  },
  rideRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  rideRequestLabel: {
    fontSize: 18,
    fontWeight: typography.bold,
    color: colors.white,
  },
  rideRequestTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing[1],
  },
  rideRequestPrice: {
    fontSize: 24,
    fontWeight: typography.bold,
    color: colors.white,
  },
  rideRequestDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    marginBottom: spacing[4],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  locationDot: {
    paddingTop: spacing[1],
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: typography.normal,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  locationText: {
    fontSize: 14,
    fontWeight: typography.semibold,
    color: colors.white,
    marginTop: spacing[1],
  },
  dividerLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: spacing[3],
  },
  rideRequestActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  declineButton: {
    flex: 0.4,
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButtonText: {
    color: colors.white,
    fontWeight: typography.semibold,
    fontSize: 14,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
  },
  acceptButtonText: {
    color: colors.primary,
    fontWeight: typography.bold,
    fontSize: 16,
  },
  quickActionsContainer: {
    position: 'absolute',
    bottom: spacing[4],
    left: spacing[4],
    right: spacing[4],
    zIndex: 9,
    flexDirection: 'row',
    gap: spacing[3],
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[2],
    ...shadows.base,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: typography.semibold,
    color: colors.black,
  },
});
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
