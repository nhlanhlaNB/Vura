import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RideContext } from '../../context/RideContext';

const DUMMY_RIDES = [
  {
    id: '1',
    date: '2026-02-07',
    time: '10:30 AM',
    pickup: '123 Main St',
    destination: '456 Park Ave',
    price: 89.50,
    driver: 'John Doe',
    status: 'completed',
    rating: 5,
  },
  {
    id: '2',
    date: '2026-02-06',
    time: '3:45 PM',
    pickup: '789 Oak Rd',
    destination: '321 Elm St',
    price: 126.80,
    driver: 'Jane Smith',
    status: 'completed',
    rating: 4,
  },
  {
    id: '3',
    date: '2026-02-05',
    time: '8:15 AM',
    pickup: '555 Broadway',
    destination: '777 5th Ave',
    price: 102.20,
    driver: 'Mike Johnson',
    status: 'completed',
    rating: 5,
  },
];

export default function RideHistoryScreen({ navigation }) {
  const { rideHistory } = useContext(RideContext);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    if (rideHistory?.length > 0) {
      setRides(rideHistory);
    } else {
      setRides(DUMMY_RIDES);
    }
  }, [rideHistory]);

  const renderRideItem = ({ item }) => (
    <TouchableOpacity style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="car" size={24} color="#000" />
        </View>
        <View style={styles.rideDetails}>
          <Text style={styles.rideDate}>{item.date} • {item.time}</Text>
          <Text style={styles.rideDriver}>{item.driver}</Text>
        </View>
        <Text style={styles.ridePrice}>R{item.price.toFixed(2)}</Text>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <Ionicons name="radio-button-on" size={16} color="green" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.pickup}
          </Text>
        </View>
        <View style={styles.locationDivider} />
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color="red" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.destination}
          </Text>
        </View>
      </View>

      <View style={styles.rideFooter}>
        <View style={styles.rating}>
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={index}
              name={index < item.rating ? 'star' : 'star-outline'}
              size={16}
              color="#FFD700"
            />
          ))}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('RideReceipt', { ride: item })}>
          <Text style={styles.rideAgain}>Receipt</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ride History</Text>
      </View>

      {rides.length > 0 ? (
        <FlatList
          data={rides}
          renderItem={renderRideItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No rides yet</Text>
          <Text style={styles.emptySubtext}>
            Your ride history will appear here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  rideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rideDetails: {
    flex: 1,
  },
  rideDate: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  rideDriver: {
    fontSize: 12,
    color: '#666',
  },
  ridePrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationContainer: {
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
    flex: 1,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  rating: {
    flexDirection: 'row',
  },
  rideAgain: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
