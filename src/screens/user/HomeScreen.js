import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from '../../components/MapComponents';
import { Ionicons } from '@expo/vector-icons';
import { LocationContext } from '../../context/LocationContext';
import LocationSearch from '../../components/LocationSearch';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { currentLocation, getCurrentLocation } = useContext(LocationContext);
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  useEffect(() => {
    getCurrentLocation().catch(() => null);
  }, [getCurrentLocation]);

  const handleRequestRide = () => {
    setShowLocationSearch(true);
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
          />
        )}
      </MapView>

      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('RideBooking')}
        >
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchText}>Where to?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="time-outline" size={24} color="#000" />
          </View>
          <Text style={styles.actionText}>Recent</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="home-outline" size={24} color="#000" />
          </View>
          <Text style={styles.actionText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="briefcase-outline" size={24} color="#000" />
          </View>
          <Text style={styles.actionText}>Work</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={() => getCurrentLocation().catch(() => null)}
      >
        <Ionicons name="locate" size={24} color="#000" />
      </TouchableOpacity>
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
