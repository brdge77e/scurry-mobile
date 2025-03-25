import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Location } from '../types/index';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { MapPin, Star, Phone, Globe, Clock } from 'lucide-react-native';

export function LocationDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const location = (route.params as { location: Location })?.location;

  if (!location) {
    return null;
  }

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location.location
    )}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {location.imageSrc ? (
          <Image
            source={{ uri: location.imageSrc }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.image}>
            <PlaceholderImage size={48} color="#6B7280" />
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.name}>{location.name}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Star size={20} color="#6A62B7" />
              <Text style={styles.detailText}>
                {location.isFavorite ? 'Favorited' : 'Not favorited'}
              </Text>
            </View>
            <TouchableOpacity style={styles.detailRow} onPress={handleOpenMaps}>
              <MapPin size={20} color="#6A62B7" />
              <Text style={styles.detailText}>{location.location}</Text>
            </TouchableOpacity>
            {location.category && (
              <View style={styles.detailRow}>
                <Globe size={20} color="#6A62B7" />
                <Text style={styles.detailText}>{location.category}</Text>
              </View>
            )}
          </View>

          {location.notes && location.notes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              {location.notes.map((note, index) => (
                <Text key={index} style={styles.note}>
                  • {note}
                </Text>
              ))}
            </View>
          )}

          {location.tags && location.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {location.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D2B3F',
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2B3F',
    marginBottom: 12,
  },
  note: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E5E1FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#6A62B7',
  },
}); 