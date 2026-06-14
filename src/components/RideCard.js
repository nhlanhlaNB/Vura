import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RideCard({ ride, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="car" size={24} color="#000" />
        </View>
        <View style={styles.details}>
          <Text style={styles.date}>{ride.date} • {ride.time}</Text>
          {ride.driver && <Text style={styles.driver}>{ride.driver}</Text>}
        </View>
        <Text style={styles.price}>R{ride.price.toFixed(2)}</Text>
      </View>

      <View style={styles.locations}>
        <View style={styles.locationRow}>
          <Ionicons name="radio-button-on" size={14} color="green" />
          <Text style={styles.locationText} numberOfLines={1}>
            {ride.pickup}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color="red" />
          <Text style={styles.locationText} numberOfLines={1}>
            {ride.destination}
          </Text>
        </View>
      </View>

      {ride.status === 'completed' && ride.rating && (
        <View style={styles.footer}>
          <View style={styles.rating}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < ride.rating ? 'star' : 'star-outline'}
                size={14}
                color="#FFD700"
              />
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  details: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  driver: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locations: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#ddd',
    marginLeft: 6,
    marginBottom: 6,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  rating: {
    flexDirection: 'row',
  },
});
