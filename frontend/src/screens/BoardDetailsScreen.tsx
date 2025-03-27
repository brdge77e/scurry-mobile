import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Board, Location } from '../types/index';
import { PlaceholderImage } from '../components/PlaceholderImage';

// const MOCK_LOCATIONS: Location[] = [
//   {
//     id: '1',
//     name: 'Central Park',
//     location: 'New York, NY',
//     imageSrc: 'https://example.com/central-park.jpg',
//     category: 'Park',
//     isFavorite: false,
//     tags: ['park', 'nature', 'recreation'],
//     notes: ['A beautiful urban park in the heart of New York City'],
//   },
//   {
//     id: '2',
//     name: 'Times Square',
//     location: 'New York, NY',
//     imageSrc: 'https://example.com/times-square.jpg',
//     category: 'Landmark',
//     isFavorite: false,
//     tags: ['landmark', 'entertainment', 'shopping'],
//     notes: ['The bustling heart of Manhattan'],
//   },
//   // Add more mock locations as needed
// ];

export function BoardDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { board } = route.params as { board: Board };

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
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: board.image }}
              style={styles.boardImage}
              onError={() => {
                // Handle image load error
              }}
            />
            <View style={styles.imageOverlay}>
              <PlaceholderImage size={48} />
            </View>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.boardName}>{board.name}</Text>
            <Text style={styles.boardDescription}>{board.description}</Text>
            <View style={styles.boardStats}>
              <Text style={styles.locationCount}>
                {board.locationCount} locations
              </Text>
              <Text style={styles.createdAt}>
                Created {new Date(board.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.locationsSection}>
        <Text style={styles.sectionTitle}>Locations</Text>
        <FlatList
          data={MOCK_LOCATIONS}
          renderItem={renderLocation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.locationsList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  boardImage: {
    width: '100%',
    height: '100%',
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
  },
  headerInfo: {
    padding: 16,
  },
  boardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D2B3F',
    marginBottom: 8,
  },
  boardDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  boardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationCount: {
    fontSize: 14,
    color: '#6A62B7',
    fontWeight: '500',
  },
  createdAt: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D2B3F',
    padding: 16,
    paddingBottom: 8,
  },
  locationsList: {
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
  locationImage: {
    width: 120,
    height: 120,
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
    marginTop: 4,
  },
}); 