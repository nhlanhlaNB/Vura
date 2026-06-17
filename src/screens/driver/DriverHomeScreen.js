import React, { useState, useContext, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, SafeAreaView, Switch,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from '../../components/MapComponents';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { LocationContext } from '../../context/LocationContext';
import { RideContext } from '../../context/RideContext';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows, typography } from '../../theme/design';

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
      <Animatable.View animation="slideInDown" duration={600} style={styles.statusCardContainer}>
        <LinearGradient
          colors={isOnline ? colors.gradients.primary : ['#F5F5F5', '#EEEEEE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statusCard}
        >
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <View style={[styles.statusIndicator, { backgroundColor: isOnline ? colors.success : colors.offline }]} />
              <View>
                <Text style={[styles.statusTitle, { color: isOnline ? colors.white : colors.black }]}>
                  {isOnline ? "You're Online" : "You're Offline"}
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
        <LinearGradient colors={['#FF6B6B', '#FFB6D9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="cash" size={28} color={colors.white} />
            <View style={styles.statText}>
              <Text style={styles.statValue}>R{totalEarnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
        </LinearGradient>

        <LinearGradient colors={['#FFA500', '#FFD700']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCard}>
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
      <TouchableOpacity style={styles.myLocationButton} onPress={() => getCurrentLocation().catch(() => null)} activeOpacity={0.8}>
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
              <TouchableOpacity style={styles.declineButton} onPress={() => setShowRideRequest(false)} activeOpacity={0.8}>
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptRide} activeOpacity={0.8}>
                <Text style={styles.acceptButtonText}>Accept Ride</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animatable.View>
      )}

      {/* Quick Actions */}
      {!showRideRequest && (
        <Animatable.View animation="slideInUp" delay={300} duration={600} style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Earnings')} activeOpacity={0.8}>
            <Ionicons name="stats-chart" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
            <Ionicons name="person-circle" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Support')} activeOpacity={0.8}>
            <Ionicons name="help-circle" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (keep all styles from the first StyleSheet.create block, unchanged)
});
