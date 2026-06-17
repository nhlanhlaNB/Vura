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
import { colors, spacing, borderRadius, shadows, typography } from '../../theme/colors';

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

      {/* Search Card */}
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
        </LinearGradient>
      </Animatable.View>

      {/* Quick Actions */}
      <Animatable.View animation="fadeIn" delay={400} duration={600} style={styles.quickActionsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsScroll}
        >
          {QUICK_LOCATIONS.map((location, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickAction}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('RideBooking')}
            >
              <LinearGradient
                colors={[location.color, `${location.color}DD`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionBg}
              >
                <Ionicons name={location.icon} size={24} color={colors.white} />
              </LinearGradient>
              <Text style={styles.quickActionLabel}>{location.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animatable.View>

      {/* My Location Button */}
      <Animatable.View animation="fadeIn" delay={500} duration={600}>
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={() => getCurrentLocation().catch(() => null)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={colors.gradients.primary}
            style={styles.myLocationGradient}
          >
            <Ionicons name="locate" size={24} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      {/* Bottom Info Card */}
      <Animatable.View animation="slideInUp" delay={300} duration={600} style={styles.infoCard}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.infoCardGradient}
        >
          <View style={styles.infoCardContent}>
            <View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
    top: spacing[4],
    left: spacing[4],
    right: spacing[4],
    zIndex: 5,
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
    position: 'relative',
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
    bottom: 120,
    left: spacing[4],
    right: spacing[4],
    zIndex: 10,
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
  quickActionsContainer: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    right: 0,
    zIndex: 9,
  },
  quickActionsScroll: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    paddingVertical: spacing[2],
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing[2],
  },
  quickActionBg: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.base,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: typography.medium,
    color: colors.black,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 220,
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
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 7,
  },
  infoCardGradient: {
    padding: spacing[4],
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
  },
  infoCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: typography.normal,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing[1],
  },
  infoCardValue: {
    fontSize: 18,
    fontWeight: typography.bold,
    color: colors.white,
  },
  infoCardButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoCardButtonText: {
    color: colors.white,
    fontWeight: typography.semibold,
    fontSize: 14,
  },
});
  map: {
    width: width,
    height: height,
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
