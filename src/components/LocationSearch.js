import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationContext } from '../context/LocationContext';

export default function LocationSearch({
  value,
  onChangeText,
  onSelectLocation,
  placeholder = 'Search location...',
  iconName = 'search',
  iconColor = '#666',
}) {
  const { searchPlaces, getPlaceDetails } = useContext(LocationContext);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasValue = useMemo(() => !!value?.trim(), [value]);

  const handleSearch = async (text) => {
    onChangeText?.(text);

    if (!text || text.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    const places = await searchPlaces(text.trim());
    setResults(places);
    setShowResults(true);
    setLoading(false);
  };

  const handleSelectLocation = async (location) => {
    const details = await getPlaceDetails(location.placeId);
    const resolved = details || location;

    onChangeText?.(resolved.address || resolved.name || '');
    setShowResults(false);
    onSelectLocation?.(resolved);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name={iconName} size={20} color={iconColor} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={handleSearch}
          onFocus={() => value?.length > 1 && setShowResults(true)}
        />
        {hasValue && (
          <TouchableOpacity onPress={() => {
            onChangeText?.('');
            setResults([]);
            setShowResults(false);
          }}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {showResults && (
        <View style={styles.resultsContainer}>
          {loading ? (
            <View style={styles.loadingRow}>
              <Text style={styles.loadingText}>Searching…</Text>
            </View>
          ) : null}

          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectLocation(item)}
              >
                <Ionicons name="location-outline" size={20} color="#000" />
                <View style={styles.resultText}>
                  <Text style={styles.resultName}>{item.name || item.address}</Text>
                  <Text style={styles.resultAddress}>{item.address}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.loadingRow}>
                  <Text style={styles.loadingText}>No results found</Text>
                </View>
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingRow: {
    padding: 12,
  },
  loadingText: {
    color: '#666',
    fontSize: 13,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultText: {
    marginLeft: 12,
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultAddress: {
    fontSize: 14,
    color: '#666',
  },
});
