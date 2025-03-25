import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Location } from '../../types/index';
import { Checkbox } from '../ui/checkbox';

interface LocationSelectionListProps {
  locations: Location[];
  selectedLocationIds: string[];
  onToggleLocation: (locationId: string) => void;
  onViewDetails: (location: Location) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  isLoading?: boolean;
}

export function LocationSelectionList({
  locations,
  selectedLocationIds,
  onToggleLocation,
  onViewDetails,
  onSelectAll,
  onDeselectAll,
  isLoading = false,
}: LocationSelectionListProps) {
  const allSelected = locations.length > 0 && selectedLocationIds.length === locations.length;

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
        <Text style={styles.emptyText}>No locations found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.selectAllButton}
          onPress={allSelected ? onDeselectAll : onSelectAll}
        >
          <Checkbox
            checked={allSelected}
            onCheckedChange={allSelected ? onDeselectAll : onSelectAll}
          />
          <Text style={styles.selectAllText}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.count}>
          {selectedLocationIds.length} of {locations.length} selected
        </Text>
      </View>

      <ScrollView style={styles.list}>
        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={styles.locationItem}
            onPress={() => onViewDetails(location)}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectAllText: {
    fontSize: 16,
    color: '#374151',
  },
  count: {
    fontSize: 14,
    color: '#6B7280',
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