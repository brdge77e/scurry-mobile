import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useToast } from '../hooks/useToast';
import { Checkbox } from '../components/Checkbox';
import { ArrowLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type LinkResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LinkResults'>;

interface Location {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
}

export function LinkResultsScreen() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const navigation = useNavigation<LinkResultsScreenNavigationProp>();
  const route = useRoute();
  const { showToast } = useToast();
  const sourceLink = (route.params as { sourceLink: string })?.sourceLink;

  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock data
        const mockLocations: Location[] = [
          {
            id: '1',
            name: 'Central Park',
            address: 'New York, NY',
            distance: '0.5 mi',
            rating: 4.8,
          },
          {
            id: '2',
            name: 'Times Square',
            address: 'New York, NY',
            distance: '1.2 mi',
            rating: 4.5,
          },
          {
            id: '3',
            name: 'Empire State Building',
            address: 'New York, NY',
            distance: '2.0 mi',
            rating: 4.7,
          },
        ];

        setLocations(mockLocations);
      } catch (error) {
        showToast('Failed to fetch locations', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationSelect = (id: string) => {
    setSelectedLocations(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleAddSelected = () => {
    if (selectedLocations.size === 0) {
      showToast('Please select at least one location', 'error');
      return;
    }

    // Navigate to SelectedLocations screen with selected locations
    navigation.navigate('SelectedLocations', {
      sourceLink,
    });
  };

  const renderLocation = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item.id)}
    >
      <Checkbox
        checked={selectedLocations.has(item.id)}
        onCheckedChange={() => handleLocationSelect(item.id)}
      />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
        <View style={styles.locationDetails}>
          <Text style={styles.locationDistance}>{item.distance}</Text>
          <Text style={styles.locationRating}>★ {item.rating}</Text>
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
        <Text style={styles.title}>Found Locations</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A62B7" />
        </View>
      ) : (
        <>
          <FlatList
            data={locations}
            renderItem={renderLocation}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddSelected}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2B3F',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDistance: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 12,
  },
  locationRating: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  addButton: {
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
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 
}); 