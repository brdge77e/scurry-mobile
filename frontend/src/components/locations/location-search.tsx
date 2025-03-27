import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { Location } from '../../types/index';

interface LocationSearchProps {
  locations: Location[];
  onSearch: (query: string) => void;
  onFilter: (filters: LocationFilters) => void;
  isLoading?: boolean;
}

interface LocationFilters {
  rating?: number;
  priceLevel?: number;
  isFavorite?: boolean;
  category?: string;
}

export function LocationSearch({
  locations,
  onSearch,
  onFilter,
  isLoading = false,
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<LocationFilters>({});
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique categories from locations
    const uniqueCategories = Array.from(
      new Set(locations.map(location => location.category))
    ).filter(Boolean);
    setCategories(uniqueCategories);
  }, [locations]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleToggleFilter = (key: keyof LocationFilters, value: any) => {
    const newFilters = {
      ...filters,
      [key]: filters[key] === value ? undefined : value,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#6B7280"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            Object.keys(filters).length > 0 && styles.filterButtonActive,
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              !filters.rating && styles.filterChipActive,
            ]}
            onPress={() => handleToggleFilter('rating', undefined)}
          >
            <Text style={styles.filterChipText}>All Ratings</Text>
          </TouchableOpacity>
          {[5, 4, 3, 2, 1].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.filterChip,
                filters.rating === rating && styles.filterChipActive,
              ]}
              onPress={() => handleToggleFilter('rating', rating)}
            >
              <Text style={styles.filterChipText}>{rating}+ Stars</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.filterChip,
              !filters.priceLevel && styles.filterChipActive,
            ]}
            onPress={() => handleToggleFilter('priceLevel', undefined)}
          >
            <Text style={styles.filterChipText}>All Prices</Text>
          </TouchableOpacity>
          {[1, 2, 3, 4].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterChip,
                filters.priceLevel === level && styles.filterChipActive,
              ]}
              onPress={() => handleToggleFilter('priceLevel', level)}
            >
              <Text style={styles.filterChipText}>
                {'$'.repeat(level)}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.filterChip,
              !filters.isFavorite && styles.filterChipActive,
            ]}
            onPress={() => handleToggleFilter('isFavorite', undefined)}
          >
            <Text style={styles.filterChipText}>All Locations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filters.isFavorite === true && styles.filterChipActive,
            ]}
            onPress={() => handleToggleFilter('isFavorite', true)}
          >
            <Text style={styles.filterChipText}>Favorites</Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                filters.category === category && styles.filterChipActive,
              ]}
              onPress={() => handleToggleFilter('category', category)}
            >
              <Text style={styles.filterChipText}>{category}</Text>
            </TouchableOpacity>
          ))}
          {Object.keys(filters).length > 0 && (
            <TouchableOpacity
              style={[styles.filterChip, styles.clearFiltersChip]}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#E5E7EB',
  },
  filtersContainer: {
    marginTop: 12,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#E5E7EB',
  },
  filterChipText: {
    fontSize: 14,
    color: '#374151',
  },
  clearFiltersChip: {
    backgroundColor: '#FEE2E2',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#DC2626',
  },
}); 