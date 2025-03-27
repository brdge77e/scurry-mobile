import { useState, useEffect } from 'react';
import { Location } from '../types/index';

const LOCATION_SUGGESTIONS = [
  "Singapore",
  "Tokyo, Japan",
  "Kyoto, Japan",
  "Osaka, Japan",
  "Bangkok, Thailand",
  "Seoul, South Korea",
  "Hong Kong",
  "Taipei, Taiwan",
  "Shanghai, China",
  "Beijing, China",
];

interface LocationFilters {
  rating?: number;
  priceLevel?: number;
  isFavorite?: boolean;
  category?: string;
}

export function useLocationSearch(locations: Location[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<LocationFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  // Filter locations based on search query and filters
  useEffect(() => {
    setIsLoading(true);
    let filtered = [...locations];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        location =>
          location.name.toLowerCase().includes(query) ||
          location.location.toLowerCase().includes(query)
      );
    }

    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter(
        location => location.rating >= filters.rating!
      );
    }

    // Apply price level filter
    if (filters.priceLevel) {
      filtered = filtered.filter(
        location => location.priceLevel === filters.priceLevel
      );
    }

    // Apply favorite filter
    if (filters.isFavorite !== undefined) {
      filtered = filtered.filter(
        location => location.isFavorite === filters.isFavorite
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        location => location.category === filters.category
      );
    }

    setFilteredLocations(filtered);
    setIsLoading(false);
  }, [locations, searchQuery, filters]);

  // Update suggestions based on search query
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matchingSuggestions = LOCATION_SUGGESTIONS.filter(
      suggestion => suggestion.toLowerCase().includes(query)
    );
    setSuggestions(matchingSuggestions.slice(0, 5)); // Limit to 5 suggestions
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: LocationFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  return {
    searchQuery,
    filteredLocations,
    suggestions,
    filters,
    isLoading,
    handleSearch,
    handleFilter,
    clearFilters,
    clearSearch,
  };
} 