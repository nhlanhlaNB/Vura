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
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: pickupCoords?.latitude || 37.78825,
          longitude: pickupCoords?.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
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
            strokeColor="#000"
            onReady={(result) => {
              setDistance(result.distance);
              setDuration(result.duration);
            }}
          />
        )}
      </MapView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.bottomSheet}>
        <View style={styles.inputContainer}>
          <LocationSearch
            placeholder="Pickup location"
            value={pickup}
            onChangeText={setPickup}
            iconName="radio-button-on"
            iconColor="green"
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
            iconColor="red"
            onSelectLocation={(location) => {
              if (location?.coords) {
                setDestinationCoords(location.coords);
              }
              setDestination(location?.address || location?.name || destination);
            }}
          />
        </View>

        <Text style={styles.sectionTitle}>Choose a ride</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {RIDE_TYPES.map((ride) => (
            <TouchableOpacity
              key={ride.id}
              style={[
                styles.rideCard,
                selectedRide.id === ride.id && styles.rideCardSelected,
              ]}
              onPress={() => setSelectedRide(ride)}
            >
              <Ionicons name={ride.icon} size={30} color="#000" />
              <View style={styles.rideInfo}>
                <Text style={styles.rideName}>{ride.name}</Text>
                <Text style={styles.rideCapacity}>{ride.capacity} seats</Text>
              </View>
              {distance > 0 && (
                <Text style={styles.ridePrice}>
                  {formatCurrencyZAR(fareByRideType[ride.id]?.finalFare || 0)}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookRide}
        >
          <Text style={styles.bookButtonText}>
            Book {selectedRide.name} • {distance > 0 ? formatCurrencyZAR(selectedFare.finalFare) : 'R0.00'}
          </Text>
        </TouchableOpacity>
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
    height: height * 0.6,
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
  bottomSheet: {
    flex: 1,
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
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 200,
  },
  rideCardSelected: {
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  rideInfo: {
    flex: 1,
    marginLeft: 15,
  },
  rideName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rideCapacity: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  ridePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
