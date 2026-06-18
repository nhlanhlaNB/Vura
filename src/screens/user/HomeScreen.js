import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from '../../components/MapComponents';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { LocationContext } from '../../context/LocationContext';
import LocationSearch from '../../components/LocationSearch';
import { colors, gradients } from '../../theme/colors';
import { spacing, borderRadius, shadows, typography } from '../../theme/design';

const { width, height } = Dimensions.get('window');

const QUICK_LOCATIONS = [
  { icon: 'home', label: 'Home', color: colors.primaryLight },
  { icon: 'briefcase', label: 'Work', color: colors.accent },
  { icon: 'star', label: 'Favorites', color: colors.secondary },
];

export default function HomeScreen({ navigation }) {
  const { currentLocation, getCurrentLocation } = useContext(LocationContext);
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  useEffect(() => {
    getCurrentLocation().catch(() => null);
  }, [getCurrentLocation]);

  return (
    <View style={styles.container}>
      {/* Full Map Background */}
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
        zoomEnabled
        scrollEnabled
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Header with profile */}
      <Animatable.View animation="slideInDown" duration={600} style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>👤</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.userName}>Traveler</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Ionicons name="notifications" size={24} color={colors.primary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </Animatable.View>

      {/* Search Card - Floating */}
      <Animatable.View animation="slideInUp" delay={200} duration={600} style={styles.searchCardContainer}>
        <LinearGradient
          colors={[colors.white, colors.lightGray]}
          style={styles.searchCard}
        >
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('RideBooking')}
            activeOpacity={0.8}
          >
            <View style={styles.searchIcon}>
              <Ionicons name="search" size={20} color={colors.primary} />
            </View>
            <View style={styles.searchTextContainer}>
              <Text style={styles.searchPlaceholder}>Where to?</Text>
              <Text style={styles.searchSubtext}>Enter destination</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </TouchableOpacity>

          {/* Quick Locations */}
          <View style={styles.divider} />
          <View style={styles.quickLocationsContainer}>
            {QUICK_LOCATIONS.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickLocationItem}
                onPress={() => navigation.navigate('RideBooking')}
                activeOpacity={0.7}
              >
                <View style={[styles.quickLocationIcon, { backgroundColor: location.color }]}>
                  <Ionicons name={location.icon} size={16} color={colors.white} />
                </View>
                <Text style={styles.quickLocationLabel}>{location.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </Animatable.View>

      {/* My Location Button */}
      <Animatable.View animation="fadeIn" delay={500} duration={600} style={styles.myLocationButtonContainer}>
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={() => getCurrentLocation().catch(() => null)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={gradients.primary}
            style={styles.myLocationGradient}
          >
            <Ionicons name="locate" size={20} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      {/* Bottom Info Card */}
      <Animatable.View animation="slideInUp" delay={300} duration={600} style={styles.infoCardContainer}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.infoCardGradient}
        >
          <View style={styles.infoCardContent}>
            <View style={styles.infoCardText}>
              <Text style={styles.infoCardTitle}>Your Daily Rides</Text>
              <Text style={styles.infoCardValue}>2 rides today</Text>
            </View>
            <TouchableOpacity
              style={styles.infoCardButton}
              onPress={() => navigation.navigate('History')}
              activeOpacity={0.8}
            >
              <Text style={styles.infoCardButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: colors.white,
    ...shadows.base,
  },
  headerContainer: {
    position: 'absolute',
    top: spacing[6],
    left: spacing[4],
    right: spacing[4],
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.base,
  },
  avatar: {
    fontSize: 28,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    color: colors.textGray,
    fontWeight: typography.normal,
  },
  userName: {
    fontSize: 16,
    fontWeight: typography.bold,
    color: colors.black,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.base,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.white,
  },
  searchCardContainer: {
    position: 'absolute',
    bottom: 80,
    left: spacing[4],
    right: spacing[4],
    zIndex: 15,
  },
  searchCard: {
    borderRadius: borderRadius.xl,
    ...shadows.xl,
    overflow: 'hidden',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
  },
  searchIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.base,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTextContainer: {
    flex: 1,
  },
  searchPlaceholder: {
    fontSize: 16,
    fontWeight: typography.semibold,
    color: colors.black,
  },
  searchSubtext: {
    fontSize: 12,
    color: colors.textGray,
    marginTop: spacing[1],
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  quickLocationsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  quickLocationItem: {
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
  },
  quickLocationIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.base,
  },
  quickLocationLabel: {
    fontSize: 11,
    fontWeight: typography.medium,
    color: colors.black,
    textAlign: 'center',
  },
  myLocationButtonContainer: {
    position: 'absolute',
    bottom: 200,
    right: spacing[4],
    zIndex: 12,
  },
  myLocationButton: {
    zIndex: 12,
  },
  myLocationGradient: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  infoCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 8,
  },
  infoCardGradient: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
  },
  infoCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCardText: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: typography.normal,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: spacing[1],
  },
  infoCardValue: {
    fontSize: 20,
    fontWeight: typography.bold,
    color: colors.white,
  },
  infoCardButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  infoCardButtonText: {
    color: colors.white,
    fontWeight: typography.semibold,
    fontSize: 13,
  },
});
