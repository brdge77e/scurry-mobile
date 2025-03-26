import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Filter, Search, Plus, X, Edit2, ArrowLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Location } from '../types/index';
import { PlaceholderImage } from '../components/PlaceholderImage';

type AllLocationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AllLocations'>;

// Predefined tags that will show in the dropdown
const PREDEFINED_TAGS = [
  'Food',
  'Nature',
  'Culture',
  'Entertainment',
  'Shopping',
  'Accomodation',
  'Landmark',
  'Services',
  'Nightlife',
  'Photo Spot',
];

interface LocationWithEditableContent extends Location {
  editableTags: string[];
  note: string | null;
}

const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'Central Park',
    location: 'New York, NY',
    imageSrc: 'https://example.com/central-park.jpg',
    category: 'Park',
    isFavorite: false,
    tags: ['park', 'nature', 'recreation'],
    notes: ['A beautiful urban park in the heart of New York City'],
  },
  {
    id: '2',
    name: 'Times Square',
    location: 'New York, NY',
    imageSrc: 'https://example.com/times-square.jpg',
    category: 'Landmark',
    isFavorite: false,
    tags: ['landmark', 'entertainment', 'shopping'],
    notes: ['The bustling heart of Manhattan'],
  },
  // Add more mock locations as needed
];

export function AllLocationsScreen() {
  const navigation = useNavigation<AllLocationsScreenNavigationProp>();
  
  // State for locations
  const [locations, setLocations] = useState<LocationWithEditableContent[]>([
    {
      id: '1',
      name: 'Japan Rail Cafe TOKYO',
      location: 'Osaka, Japan',
      category: 'Food',
      isFavorite: false,
      tags: ['Food', 'Cafe'],
      editableTags: ['Food', 'Cafe'],
      note: 'Great place for Japanese railway enthusiasts',
      sourceLink: 'https://www.jrailcafe.com',
    },
    {
      id: '2',
      name: 'SkyTree Cafe 350',
      location: 'Tokyo, Japan',
      category: 'Food',
      isFavorite: true,
      tags: ['Food'],
      editableTags: ['Food'],
      note: null,
      sourceLink: 'https://www.skytree.jp',
    },
    // Add more mock locations as needed
  ]);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    location: string;
    tags: string[];
  }>({ location: '', tags: [] });
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Edit location state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationWithEditableContent | null>(null);
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editedNote, setEditedNote] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Filter locations based on search query and active filters
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !activeFilters.location || 
      location.location.toLowerCase().includes(activeFilters.location.toLowerCase());
    const matchesTags = activeFilters.tags.length === 0 || 
      activeFilters.tags.every(tag => location.editableTags.includes(tag));
    return matchesSearch && matchesLocation && matchesTags;
  });

  const handleOpenFilterModal = () => {
    setLocationFilter(activeFilters.location);
    setTagFilter('');
    setIsFilterModalVisible(true);
  };

  const handleApplyFilter = () => {
    setActiveFilters({
      location: locationFilter,
      tags: tagFilter ? [tagFilter, ...activeFilters.tags] : activeFilters.tags,
    });
    setIsFilterModalVisible(false);
    setTagFilter('');
  };

  const handleClearFilters = () => {
    setActiveFilters({ location: '', tags: [] });
    setLocationFilter('');
    setTagFilter('');
  };

  const handleOpenEditModal = (location: LocationWithEditableContent) => {
    setCurrentLocation(location);
    setEditedTags([...location.editableTags]);
    setEditedNote(location.note || '');
    setIsEditModalVisible(true);
  };

  const handleSaveLocationEdit = () => {
    if (!currentLocation) return;

    const updatedLocations = locations.map(location => {
      if (location.id === currentLocation.id) {
        return {
          ...location,
          editableTags: editedTags,
          note: editedNote.trim() || null,
        };
      }
      return location;
    });

    setLocations(updatedLocations);
    setIsEditModalVisible(false);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = tagInput.trim();
    if (!editedTags.includes(newTag)) {
      setEditedTags([...editedTags, newTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== filter),
      location: filter === prev.location ? '' : prev.location,
    }));
  };

  const renderLocationItem = ({ item }: { item: LocationWithEditableContent }) => (
    <View style={styles.locationCard}>
      <View style={styles.locationHeader}>
        <View>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.locationAddress}>{item.location}</Text>
        </View>
        <TouchableOpacity onPress={() => handleOpenEditModal(item)}>
          <Edit2 size={20} color="#6A62B7" />
        </TouchableOpacity>
      </View>

      <View style={styles.tagsContainer}>
        {item.editableTags.map((tag, index) => (
          <View key={index} style={[styles.tagItem, { backgroundColor: getTagColor(tag) }]}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>All Locations</Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search saved locations"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterTabs}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Favourites</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterActions}>
          {activeFilters.tags.length > 0 || activeFilters.location ? (
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          ) : null}
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={handleOpenFilterModal}
          >
            <Filter size={20} color="#6A62B7" />
          </TouchableOpacity>
        </View>
      </View>

      {(activeFilters.tags.length > 0 || activeFilters.location) && (
        <View style={styles.activeFiltersContainer}>
          {activeFilters.location && (
            <TouchableOpacity 
              style={styles.activeFilterTag}
              onPress={() => handleRemoveFilter(activeFilters.location)}
            >
              <Text style={styles.activeFilterText}>{activeFilters.location}</Text>
              <X size={16} color="#6A62B7" />
            </TouchableOpacity>
          )}
          {activeFilters.tags.map((tag, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.activeFilterTag}
              onPress={() => handleRemoveFilter(tag)}
            >
              <Text style={styles.activeFilterText}>{tag}</Text>
              <X size={16} color="#6A62B7" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={filteredLocations}
        renderItem={renderLocationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.filterModalContainer}>
          <View style={styles.filterModalContent}>
            <View style={styles.filterModalHeader}>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <ArrowLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.filterModalTitle}>Filter by</Text>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>City, Country</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Enter city, country"
                value={locationFilter}
                onChangeText={setLocationFilter}
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Tags</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Add tag"
                value={tagFilter}
                onChangeText={setTagFilter}
                onFocus={() => setShowTagSuggestions(true)}
              />
              
              {showTagSuggestions && (
                <ScrollView style={styles.tagSuggestions}>
                  {PREDEFINED_TAGS.filter(tag => 
                    !activeFilters.tags.includes(tag) &&
                    tag.toLowerCase().includes(tagFilter.toLowerCase())
                  ).map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.tagSuggestion}
                      onPress={() => {
                        setActiveFilters(prev => ({
                          ...prev,
                          tags: [...prev.tags, tag]
                        }));
                        setTagFilter('');
                      }}
                    >
                      <Text style={styles.tagSuggestionText}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <TouchableOpacity
              style={styles.applyFilterButton}
              onPress={handleApplyFilter}
            >
              <Text style={styles.applyFilterText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Location Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.editModalContainer}>
          <View style={styles.editModalContent}>
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>{currentLocation?.name}</Text>
              <Text style={styles.editModalSubtitle}>{currentLocation?.category}</Text>
              <Text style={styles.editModalLocation}>{currentLocation?.location}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <X size={24} color="#2D2B3F" />
              </TouchableOpacity>
            </View>

            <View style={styles.editSection}>
              <Text style={styles.editSectionTitle}>Tags</Text>
              <View style={styles.editTagsContainer}>
                {editedTags.map((tag, index) => (
                  <View key={index} style={[styles.tagItem, { backgroundColor: getTagColor(tag) }]}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                      <X size={12} color="#6A62B7" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity 
                  style={styles.addTagButton}
                  onPress={() => setShowTagSuggestions(true)}
                >
                  <Text style={styles.addTagText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.editSection}>
              <Text style={styles.editSectionTitle}>Note</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Add a note..."
                value={editedNote}
                onChangeText={setEditedNote}
                multiline
              />
            </View>

            <View style={styles.editSection}>
              <Text style={styles.editSectionTitle}>Source Link</Text>
              <Text style={styles.sourceLink}>{currentLocation?.sourceLink}</Text>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveLocationEdit}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Helper function to get a color based on tag name
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
    'Nightlife': '#6A5ACD',
    'Photo Spot': '#F4A460',
  };

  return colors[tag as keyof typeof colors] || '#E5E1FF';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D2B3F',
    padding: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#2D2B3F',
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTabs: {
    flexDirection: 'row',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6A62B7',
    paddingBottom: 8,
    marginRight: 24,
  },
  activeTabText: {
    color: '#6A62B7',
    fontSize: 16,
    fontWeight: '500',
  },
  tab: {
    paddingBottom: 8,
    marginRight: 24,
  },
  tabText: {
    color: '#6B7280',
    fontSize: 16,
  },
  filterActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearFiltersButton: {
    marginRight: 16,
  },
  clearFiltersText: {
    color: '#6A62B7',
    fontSize: 14,
  },
  filterButton: {
    padding: 8,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A62B7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterText: {
    color: '#FFFFFF',
    marginRight: 8,
  },
  listContent: {
    padding: 16,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2B3F',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 16,
    color: '#6B7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#2D2B3F',
  },
  filterModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModalContent: {
    flex: 1,
    backgroundColor: '#6A62B7',
    marginLeft: '30%',
    padding: 24,
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  filterModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  filterInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  tagSuggestions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: 200,
  },
  tagSuggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tagSuggestionText: {
    fontSize: 16,
    color: '#2D2B3F',
  },
  applyFilterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  applyFilterText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6A62B7',
  },
  editModalContainer: {
    flex: 1,
    backgroundColor: '#6A62B7',
  },
  editModalContent: {
    flex: 1,
    padding: 24,
  },
  editModalHeader: {
    marginBottom: 32,
  },
  editModalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  editModalSubtitle: {
    fontSize: 20,
    color: '#E5E1FF',
    marginBottom: 4,
  },
  editModalLocation: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  editSection: {
    marginBottom: 24,
  },
  editSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  editTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  addTagButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addTagText: {
    color: '#6A62B7',
    fontSize: 14,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sourceLink: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6A62B7',
  },
}); 