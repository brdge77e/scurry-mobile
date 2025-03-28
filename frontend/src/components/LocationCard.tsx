import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Location } from '../types/index';
import { PlaceholderImage } from './PlaceholderImage';

interface LocationCardProps {
  location: Location;
  onEdit?: () => void;
  onPress?: () => void;
}

// Helper function to get tag color based on tag name
function getTagColor(tag: string): string {
  const colors = {
    'Food': '#FFD700',
    'Nature': '#90EE90',
    'Culture': '#DEB887',
    'Entertainment': '#ADD8E6',
    'Shopping': '#FFC0CB',
    'Accomodation': '#F5DEB3',
    'Landmark': '#D8BFD8',
    'Services': '#8FBC8F',
    'Nightlife': '#A495FD',
    'Photo Spot': '#F4A460',
  };

  return colors[tag as keyof typeof colors] || '#E5E1FF';
}

export function LocationCard({ location, onEdit, onPress }: LocationCardProps) {
  return (
    <TouchableOpacity
      style={styles.locationCard}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {location.imageSrc ? (
          <Image
            source={{ uri: location.imageSrc }}
            style={styles.locationImage}
            onError={() => {
              // Handle image load error
            }}
          />
        ) : (
          <View style={styles.imageOverlay}>
            <PlaceholderImage size={32} />
          </View>
        )}
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
        {/* <Text style={styles.locationCategory}>{location.category}</Text> */}
        <Text style={styles.locationAddress}>{location.location}</Text>
        {location.note && (
          <Text style={styles.locationDescription} numberOfLines={2}>
            {location.note}
          </Text>
        )}
        {location.tags && location.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {location.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={[styles.tagItem, { backgroundColor: getTagColor(tag) }]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {location.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{location.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>
      {onEdit && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  // locationCategory: {
  //   fontSize: 14,
  //   color: '#6B7280',
  //   marginBottom: 2,
  // },
  locationAddress: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tagItem: {
    backgroundColor: '#E5E1FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#000000',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#000000',
    marginLeft: 4,
    alignSelf: 'center',
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  editButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
}); 