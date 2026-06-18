import React, { useState, useContext, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from '../components/MapComponents';
import MapViewDirections from '../components/MapDirections';
import { Ionicons } from '@expo/vector-icons';
import { LocationContext } from '../context/LocationContext';
import { RideContext } from '../context/RideContext';
import { GOOGLE_MAPS_API_KEY } from '@env';
import LocationSearch from '../components/LocationSearch';
import { calculateTripFare, formatCurrencyZAR } from '../services/fareService';

const { width, height } = Dimensions.get('window');

const RIDE_TYPES = [
  { id: 'economy', name: 'Economy', icon: 'car', multiplier: 1, capacity: 4 },
  { id: 'comfort', name: 'Comfort', icon: 'car-sport', multiplier: 1.25, capacity: 4 },
  { id: 'xl', name: 'XL', icon: 'car', multiplier: 1.55, capacity: 6 },
];

export default function RideBookingScreen({ navigation }) {
  const { currentLocation, geocode } = useContext(LocationContext);
  const { createRide } = useContext(RideContext);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [selectedRide, setSelectedRide] = useState(RIDE_TYPES[0]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pricingDate] = useState(() => new Date());

  useEffect(() => {
    if (currentLocation) {
      setPickupCoords({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
      if (!pickup) {
        setPickup('Current location');
      }
    }
  }, [currentLocation]);

  const demandContext = useMemo(
    () => ({
      date: pricingDate,
    }),
    [pricingDate]
  );

  const selectedFare = useMemo(
    () =>
      calculateTripFare({
        distanceKm: distance,
        durationMin: duration,
        rideType: selectedRide.id,
        demandContext,
      }),
    [distance, duration, selectedRide.id, demandContext]
  );

  const fareByRideType = useMemo(
    () =>
      RIDE_TYPES.reduce((accumulator, ride) => {
        accumulator[ride.id] = calculateTripFare({
          distanceKm: distance,
          durationMin: duration,
          rideType: ride.id,
          demandContext,
        });
        return accumulator;
      }, {}),
    [distance, duration, demandContext]
  );

  const handleBookRide = async () => {
    let resolvedPickupCoords = pickupCoords;
    let resolvedDestinationCoords = destinationCoords;

    try {
      if (!resolvedPickupCoords && pickup?.trim()) {
        const result = await geocode(pickup.trim());
        if (result) {
          resolvedPickupCoords = {
            latitude: result.latitude,
            longitude: result.longitude,
          };
          if (result.formattedAddress) {
            setPickup(result.formattedAddress);
          }
        }
      }

      if (!resolvedDestinationCoords && destination?.trim()) {
        const result = await geocode(destination.trim());
        if (result) {
          resolvedDestinationCoords = {
            latitude: result.latitude,
            longitude: result.longitude,
          };
          if (result.formattedAddress) {
            setDestination(result.formattedAddress);
          }
        }
      }
    } catch (error) {
      Alert.alert('Location error', 'Could not resolve one of the addresses.');
      return;
    }

    if (!resolvedPickupCoords || !resolvedDestinationCoords) {
      Alert.alert('Missing location', 'Please select both pickup and destination from suggestions.');
      return;
    }

    const rideData = {
      pickup: resolvedPickupCoords,
      destination: resolvedDestinationCoords,
      pickupAddress: pickup || 'Pickup point',
      destinationAddress: destination || 'Destination point',
      rideType: selectedRide.id,
      price: selectedFare.finalFare,
      fareBreakdown: selectedFare.breakdown,
      surgeMultiplier: selectedFare.surgeMultiplier,
      distance,
      duration,
    };

    await createRide(rideData);
    navigation.navigate('RideTracking');
  };

  return (
    <View style={styles.container}>
      {/* Full Screen Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: pickupCoords?.latitude || 37.78825,
          longitude: pickupCoords?.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        zoomEnabled
        scrollEnabled
      >
        {pickupCoords && (
          <Marker
            coordinate={pickupCoords}
            title="Pickup"
            pinColor="green"
          />
        )}
        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            pinColor="red"
          />
        )}
        {pickupCoords && destinationCoords && (
          <MapViewDirections
            origin={pickupCoords}
            destination={destinationCoords}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="#E50000"
            strokeColors={['#E50000']}
            onReady={(result) => {
              setDistance(result.distance);
              setDuration(result.duration);
            }}
          />
        )}
      </MapView>

      {/* Back Button - Top Left */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Drag Handle - Between map and sheet */}
      <View style={styles.dragHandleContainer}>
        <View style={styles.dragHandle} />
      </View>

      {/* Bottom Sheet - Location & Ride Selection */}
      <View style={styles.bottomSheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Location Inputs */}
          <View style={styles.inputContainer}>
            <LocationSearch
              placeholder="Pickup location"
              value={pickup}
              onChangeText={setPickup}
              iconName="radio-button-on"
              iconColor="#00C853"
              onSelectLocation={(location) => {
                if (location?.coords) {
                  setPickupCoords(location.coords);
                }
                setPickup(location?.address || location?.name || pickup);
              }}
            />

            <LocationSearch
              placeholder="Where to?"
              value={destination}
              onChangeText={setDestination}
              iconName="location"
              iconColor="#E50000"
              onSelectLocation={(location) => {
                if (location?.coords) {
                  setDestinationCoords(location.coords);
                }
                setDestination(location?.address || location?.name || destination);
              }}
            />
          </View>

          {/* Route Info */}
          {distance > 0 && (
            <View style={styles.routeInfo}>
              <View style={styles.routeDetail}>
                <Ionicons name="navigate" size={18} color="#E50000" />
                <Text style={styles.routeText}>{distance.toFixed(1)} km</Text>
              </View>
              <View style={styles.routeDetail}>
                <Ionicons name="time-outline" size={18} color="#E50000" />
                <Text style={styles.routeText}>{Math.round(duration)} min</Text>
              </View>
            </View>
          )}

          {/* Ride Type Selection */}
          <View style={styles.rideSelectionContainer}>
            <Text style={styles.sectionTitle}>Choose your ride</Text>
            <View style={styles.rideCardsWrapper}>
              {RIDE_TYPES.map((ride) => (
                <TouchableOpacity
                  key={ride.id}
                  style={[
                    styles.rideCard,
                    selectedRide.id === ride.id && styles.rideCardSelected,
                  ]}
                  onPress={() => setSelectedRide(ride)}
                  activeOpacity={0.8}
                >
                  <View style={styles.rideIconContainer}>
                    <Ionicons name={ride.icon} size={28} color={selectedRide.id === ride.id ? '#fff' : '#E50000'} />
                  </View>
                  <View style={styles.rideInfo}>
                    <Text style={[styles.rideName, selectedRide.id === ride.id && styles.rideNameSelected]}>
                      {ride.name}
                    </Text>
                    <Text style={styles.rideCapacity}>{ride.capacity} seats</Text>
                  </View>
                  {distance > 0 && (
                    <Text style={[styles.ridePrice, selectedRide.id === ride.id && styles.ridePriceSelected]}>
                      {formatCurrencyZAR(fareByRideType[ride.id]?.finalFare || 0)}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pricing Breakdown */}
          {distance > 0 && (
            <View style={styles.pricingContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>{formatCurrencyZAR(selectedFare.breakdown.baseFare)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Distance ({distance.toFixed(1)} km)</Text>
                <Text style={styles.priceValue}>{formatCurrencyZAR(selectedFare.breakdown.distanceFare)}</Text>
              </View>
              {selectedFare.surgeMultiplier > 1 && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Surge ({selectedFare.surgeMultiplier.toFixed(1)}x)</Text>
                  <Text style={[styles.priceValue, styles.surgePriceValue]}>+{formatCurrencyZAR(selectedFare.breakdown.surgeFare)}</Text>
                </View>
              )}
              <View style={[styles.priceRow, styles.priceRowTotal]}>
                <Text style={styles.priceTotalLabel}>Total</Text>
                <Text style={styles.priceTotalValue}>{formatCurrencyZAR(selectedFare.finalFare)}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.bookButton, !destinationCoords && styles.bookButtonDisabled]}
          onPress={handleBookRide}
          disabled={!destinationCoords}
          activeOpacity={0.85}
        >
          <Text style={styles.bookButtonText}>
            Book {selectedRide.name} • {distance > 0 ? formatCurrencyZAR(selectedFare.finalFare) : 'Calculate fare'}
          </Text>
        </TouchableOpacity>
      </View>
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
    bottom: height * 0.48,
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
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    maxHeight: height * 0.52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 25,
  },
  inputContainer: {
    marginBottom: 16,
    gap: 12,
  },
  routeInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  routeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  rideSelectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  rideCardsWrapper: {
    gap: 10,
  },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  rideCardSelected: {
    borderColor: '#E50000',
    backgroundColor: '#E50000',
  },
  rideIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rideInfo: {
    flex: 1,
  },
  rideName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  rideNameSelected: {
    color: '#fff',
  },
  rideCapacity: {
    fontSize: 13,
    color: '#757575',
  },
  ridePrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E50000',
  },
  ridePriceSelected: {
    color: '#fff',
  },
  pricingContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceRowTotal: {
    borderBottomWidth: 0,
    paddingVertical: 12,
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  surgePriceValue: {
    color: '#E50000',
  },
  priceTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  priceTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E50000',
  },
  bookButton: {
    backgroundColor: '#E50000',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#E50000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
