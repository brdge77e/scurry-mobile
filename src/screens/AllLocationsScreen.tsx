import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Location } from '../types/index';
import { PlaceholderImage } from '../components/PlaceholderImage';

const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'Central Park',
    location: 'New York, NY',
    imageSrc: 'https://example.com/central-park.jpg',
    category: 'Park',
    isFavorite: false,
    tags: ['park', 'nature', 'recreation'],
    notes: ['A beautiful urban park in the heart of New York City'],
  },
  {
    id: '2',
    name: 'Times Square',
    location: 'New York, NY',
    imageSrc: 'https://example.com/times-square.jpg',
    category: 'Landmark',
    isFavorite: false,
    tags: ['landmark', 'entertainment', 'shopping'],
    notes: ['The bustling heart of Manhattan'],
  },
  // Add more mock locations as needed
];

export function AllLocationsScreen() {
  const navigation = useNavigation();

  const renderLocation = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.locationCard}
      onPress={() => navigation.navigate('LocationDetails', { location: item })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageSrc }}
          style={styles.locationImage}
          onError={() => {
            // Handle image load error
          }}
        />
        <View style={styles.imageOverlay}>
          <PlaceholderImage size={32} />
        </View>
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationCategory}>{item.category}</Text>
        <Text style={styles.locationAddress}>{item.location}</Text>
        {item.notes && item.notes.length > 0 && (
          <Text style={styles.locationDescription}>{item.notes[0]}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Locations</Text>
      </View>
      <FlatList
        data={MOCK_LOCATIONS}
        renderItem={renderLocation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D2B3F',
  },
  list: {
    padding: 16,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  locationImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  locationInfo: {
    flex: 1,
    padding: 12,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2B3F',
    marginBottom: 4,
  },
  locationCategory: {
    fontSize: 14,
    color: '#6A62B7',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  locationDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
}); 