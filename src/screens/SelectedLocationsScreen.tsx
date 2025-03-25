import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useToast } from '../hooks/useToast';
import { Location } from '../types/index';

type SelectedLocationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectedLocations'>;

export function SelectedLocationsScreen() {
  const navigation = useNavigation<SelectedLocationsScreenNavigationProp>();
  const route = useRoute();
  const { showToast } = useToast();
  const sourceLink = (route.params as { sourceLink: string })?.sourceLink;
  const [locations] = useState<Location[]>([
    {
      id: '1',
      name: 'Central Park',
      location: 'New York, NY',
      imageSrc: 'https://example.com/central-park.jpg',
      category: 'Park',
      isFavorite: false,
      tags: [],
      notes: [],
      sourceLink: sourceLink,
    },
    {
      id: '2',
      name: 'Times Square',
      location: 'New York, NY',
      imageSrc: 'https://example.com/times-square.jpg',
      category: 'Landmark',
      isFavorite: false,
      tags: [],
      notes: [],
      sourceLink: sourceLink,
    },
  ]);

  const handleLocationPress = (location: Location) => {
    navigation.navigate('LocationDetails', { location });
  };

  const renderLocation = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationPress(item)}
    >
      {item.imageSrc ? (
        <Image
          source={{ uri: item.imageSrc }}
          style={styles.locationImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.location}</Text>
        <View style={styles.locationDetails}>
          <Text style={styles.detailText}>{item.category}</Text>
          {item.tags && item.tags.length > 0 && (
            <Text style={styles.detailText}>
              {item.tags.join(', ')}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#6A62B7" />
        </TouchableOpacity>
        <Text style={styles.title}>Selected Locations</Text>
      </View>

      <FlatList
        data={locations}
        renderItem={renderLocation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            navigation.navigate('Main', {
              screen: 'AllBoards',
            });
          }}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D2B3F',
  },
  listContent: {
    padding: 16,
  },
  locationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationImage: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#6B7280',
    fontSize: 14,
  },
  locationInfo: {
    padding: 16,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2B3F',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 12,
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#6A62B7',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 