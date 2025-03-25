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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Board } from '../types';
import { RootStackParamList } from '../types/navigation';
import { PlaceholderImage } from '../components/PlaceholderImage';

type AllBoardsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MOCK_BOARDS: Board[] = [
  {
    id: '1',
    name: 'Favorite Restaurants',
    description: 'My go-to spots for great food',
    image: 'https://example.com/restaurants.jpg',
    locationCount: 12,
    category: 'Food',
    tags: ['restaurants', 'food', 'favorites'],
    isPublic: false,
    createdBy: 'user1',
    collaborators: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Travel Bucket List',
    description: 'Places I want to visit someday',
    image: 'https://example.com/travel.jpg',
    locationCount: 25,
    category: 'Travel',
    tags: ['travel', 'bucket-list', 'future'],
    isPublic: true,
    createdBy: 'user1',
    collaborators: ['user2'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  // Add more mock boards as needed
];

export function AllBoardsScreen() {
  const navigation = useNavigation<AllBoardsScreenNavigationProp>();

  const renderBoard = ({ item }: { item: Board }) => (
    <TouchableOpacity
      style={styles.boardCard}
      onPress={() => navigation.navigate('BoardDetails', { board: item })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.boardImage}
          onError={() => {
            // Handle image load error
          }}
        />
        <View style={styles.imageOverlay}>
          <PlaceholderImage size={48} />
        </View>
      </View>
      <View style={styles.boardInfo}>
        <Text style={styles.boardName}>{item.name}</Text>
        <Text style={styles.boardDescription}>{item.description}</Text>
        <View style={styles.boardStats}>
          <Text style={styles.locationCount}>
            {item.locationCount} locations
          </Text>
          <Text style={styles.createdAt}>
            Created {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Boards</Text>
      </View>
      <FlatList
        data={MOCK_BOARDS}
        renderItem={renderBoard}
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
  boardCard: {
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
    width: '100%',
    height: 160,
  },
  boardImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    borderTopRightRadius: 12,
  },
  boardInfo: {
    padding: 16,
  },
  boardName: {
    fontSize: 20,
    fontWeight: '600',
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
}); 