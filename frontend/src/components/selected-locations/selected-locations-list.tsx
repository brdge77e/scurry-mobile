import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Location } from '../../types/index';
import { Checkbox } from '../ui/checkbox';
import { Trash2, Share2, MapPin } from 'lucide-react-native';

interface SelectedLocationsListProps {
  locations: Location[];
  selectedLocationIds: string[];
  onToggleLocation: (locationId: string) => void;
  onDeleteSelected: () => void;
  onShareSelected: () => void;
  onViewOnMap: () => void;
  isLoading?: boolean;
}

export function SelectedLocationsList({
  locations,
  selectedLocationIds,
  onToggleLocation,
  onDeleteSelected,
  onShareSelected,
  onViewOnMap,
  isLoading = false,
}: SelectedLocationsListProps) {
  const selectedCount = selectedLocationIds.length;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading locations...</Text>
      </View>
    );
  }

  if (locations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No locations selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selected Locations</Text>
        <Text style={styles.count}>{selectedCount} selected</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.mapButton]}
          onPress={onViewOnMap}
          disabled={selectedCount === 0}
        >
          <MapPin size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>View on Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={onShareSelected}
          disabled={selectedCount === 0}
        >
          <Share2 size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDeleteSelected}
          disabled={selectedCount === 0}
        >
          <Trash2 size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={styles.locationItem}
            onPress={() => onToggleLocation(location.id)}
          >
            <View style={styles.locationContent}>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationAddress}>{location.location}</Text>
              </View>
              <Checkbox
                checked={selectedLocationIds.includes(location.id)}
                onCheckedChange={() => onToggleLocation(location.id)}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  count: {
    fontSize: 14,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  mapButton: {
    backgroundColor: '#3B82F6',
  },
  shareButton: {
    backgroundColor: '#10B981',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  locationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
    marginRight: 16,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
}); 