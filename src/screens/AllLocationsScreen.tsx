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
import { LocationCard } from '../components/LocationCard';

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
  const [locationFilterTags, setLocationFilterTags] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState('');
  const [tagFilterTags, setTagFilterTags] = useState<string[]>([]);
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
    
    // For location, consider it a match if any of the active filter locations are present
    const matchesLocation = !activeFilters.location || 
      (activeFilters.location.split(', ').some(filterLoc => 
        location.location.toLowerCase().includes(filterLoc.toLowerCase())
      ));
    
    const matchesTags = activeFilters.tags.length === 0 || 
      activeFilters.tags.every(tag => location.editableTags.includes(tag));
    return matchesSearch && matchesLocation && matchesTags;
  });

  const handleOpenFilterModal = () => {
    setLocationFilterTags(activeFilters.location ? [activeFilters.location] : []);
    setLocationFilter('');
    setTagFilterTags([...activeFilters.tags]);
    setTagFilter('');
    setIsFilterModalVisible(true);
  };

  const handleAddLocationTag = () => {
    if (!locationFilter.trim()) return;
    if (!locationFilterTags.includes(locationFilter)) {
      setLocationFilterTags([...locationFilterTags, locationFilter]);
    }
    setLocationFilter('');
  };

  const handleRemoveLocationTag = (tag: string) => {
    setLocationFilterTags(locationFilterTags.filter(t => t !== tag));
  };

  const handleAddTagFilterTag = () => {
    if (!tagFilter.trim()) return;
    if (!tagFilterTags.includes(tagFilter)) {
      setTagFilterTags([...tagFilterTags, tagFilter]);
    }
    setTagFilter('');
  };

  const handleTagFilterKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && tagFilter.trim()) {
      handleAddTagFilterTag();
    }
  };

  const handleLocationFilterKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && locationFilter.trim()) {
      handleAddLocationTag();
    }
  };

  const handleRemoveTagFilterTag = (tag: string) => {
    setTagFilterTags(tagFilterTags.filter(t => t !== tag));
  };

  const handlePredefinedTagPress = (tag: string) => {
    if (!tagFilterTags.includes(tag)) {
      setTagFilterTags([...tagFilterTags, tag]);
    }
  };

  const handleApplyFilter = () => {
    setActiveFilters({
      location: locationFilterTags.length > 0 ? locationFilterTags.join(', ') : '',
      tags: [...tagFilterTags],
    });
    setIsFilterModalVisible(false);
  };

  const handleClearFilters = () => {
    setActiveFilters({ location: '', tags: [] });
    setLocationFilter('');
    setLocationFilterTags([]);
    setTagFilter('');
    setTagFilterTags([]);
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

  const handleSelectPredefinedTag = (tag: string) => {
    if (!editedTags.includes(tag)) {
      setEditedTags([...editedTags, tag]);
    }
  };

  const renderLocationItem = ({ item }: { item: LocationWithEditableContent }) => (
    <LocationCard
      location={item}
      onEdit={() => handleOpenEditModal(item)}
      onPress={() => navigation.navigate('LocationDetails', { locationId: item.id })}
    />
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
          <View style={styles.activeFilterTagsWrapper}>
            {activeFilters.location && activeFilters.location.split(', ').map((locationFilter, idx) => (
              <TouchableOpacity 
                key={`loc-${idx}`}
                style={[styles.activeFilterTag, styles.locationFilterTag]}
                onPress={() => handleRemoveFilter(locationFilter)}
              >
                <Text style={styles.activeFilterText}>{locationFilter}</Text>
                <X size={16} color="#1F2937" />
              </TouchableOpacity>
            ))}
            {activeFilters.tags.map((tag, index) => (
              <TouchableOpacity 
                key={`tag-${index}`}
                style={[styles.activeFilterTag, { backgroundColor: getTagColor(tag) }]}
                onPress={() => handleRemoveFilter(tag)}
              >
                <Text style={styles.activeFilterText}>{tag}</Text>
                <X size={16} color="#1F2937" />
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {filteredLocations.length > 0 ? (
        <FlatList
          data={filteredLocations}
          renderItem={renderLocationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No location results</Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        transparent
        visible={isFilterModalVisible}
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.filterModalContainer}>
          <View style={styles.filterModalContent}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filter by</Text>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Location</Text>
              
              <View style={styles.tagInputContainer}>
                {locationFilterTags.map((tag, index) => (
                  <View key={index} style={[styles.selectedTagItem, styles.locationTagItem]}>
                    <Text style={styles.selectedTagText}>{tag}</Text>
                    <TouchableOpacity onPress={() => handleRemoveLocationTag(tag)}>
                      <X size={14} color="#6A62B7" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TextInput
                  style={[
                    styles.filterInput,
                    locationFilterTags.length > 0 ? styles.tagInputWithTags : {}
                  ]}
                  placeholder={locationFilterTags.length > 0 ? "" : "Enter location"}
                  value={locationFilter}
                  onChangeText={setLocationFilter}
                  onSubmitEditing={handleAddLocationTag}
                  onKeyPress={handleLocationFilterKeyPress}
                />
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Enter tag</Text>
              
              <View style={styles.tagInputContainer}>
                {tagFilterTags.map((tag, index) => (
                  <View key={index} style={[styles.selectedTagItem, { backgroundColor: getTagColor(tag) }]}>
                    <Text style={styles.selectedTagText}>{tag}</Text>
                    <TouchableOpacity onPress={() => handleRemoveTagFilterTag(tag)}>
                      <X size={14} color="#6A62B7" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TextInput
                  style={[
                    styles.filterInput,
                    tagFilterTags.length > 0 ? styles.tagInputWithTags : {}
                  ]}
                  placeholder={tagFilterTags.length > 0 ? "" : "Enter tag"}
                  value={tagFilter}
                  onChangeText={setTagFilter}
                  onSubmitEditing={handleAddTagFilterTag}
                  onKeyPress={handleTagFilterKeyPress}
                />
              </View>
            </View>

            <View style={styles.filterTags}>
              {PREDEFINED_TAGS.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tagItem,
                    { backgroundColor: getTagColor(tag) },
                    tagFilterTags.includes(tag) && styles.selectedPredefinedTag
                  ]}
                  onPress={() => handlePredefinedTagPress(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.filterActionButton}
                onPress={() => setIsFilterModalVisible(false)}
              >
                <Text style={styles.filterActionButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterActionButton, styles.applyButton]}
                onPress={handleApplyFilter}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Location Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="fade"
        transparent={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableOpacity 
            style={styles.editModalOverlay}
            activeOpacity={1}
            onPress={() => setIsEditModalVisible(false)}
          >
            <View style={styles.editModalContainer}>
              <ScrollView contentContainerStyle={styles.editModalContent}>
                <View style={styles.editModalHeader}>
                  <Text style={styles.editModalTitle}>{currentLocation?.name}</Text>
                  <Text style={styles.editModalSubtitle}>{currentLocation?.category}</Text>
                  <Text style={styles.editModalLocation}>{currentLocation?.location}</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setIsEditModalVisible(false)}
                  >
                    <X size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.editSection}>
                  <Text style={styles.editSectionTitle}>Tags</Text>
                  <View style={styles.tagInputContainer}>
                    {editedTags.map((tag, index) => (
                      <View key={index} style={[styles.selectedTagItem, { backgroundColor: getTagColor(tag) }]}>
                        <Text style={styles.selectedTagText}>{tag}</Text>
                        <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                          <X size={14} color="#6A62B7" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TextInput
                      style={[
                        styles.tagInputWithTags,
                        editedTags.length > 0 ? {} : { minWidth: '100%' }
                      ]}
                      placeholder={editedTags.length > 0 ? "" : "+ Add tag"}
                      value={tagInput}
                      onChangeText={setTagInput}
                      onFocus={() => setShowTagSuggestions(true)}
                      onSubmitEditing={handleAddTag}
                    />
                  </View>
                  
                  {showTagSuggestions && (
                    <View style={styles.tagsSection}>
                      <View style={styles.tagsGrid}>
                        {PREDEFINED_TAGS.map((tag, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.tagItem,
                              { backgroundColor: getTagColor(tag) },
                              editedTags.includes(tag) && styles.selectedPredefinedTag
                            ]}
                            onPress={() => handleSelectPredefinedTag(tag)}
                          >
                            <Text style={styles.tagText}>{tag}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
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
              </ScrollView>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
  filterButton: {
    padding: 8,
  },
  activeFiltersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  activeFilterTagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterText: {
    color: '#1F2937',
    marginRight: 8,
    fontWeight: '500',
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  clearFiltersText: {
    color: '#6A62B7',
    fontSize: 14,
    fontWeight: '500',
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
    justifyContent: 'flex-start',
  },
  filterModalContent: {
    backgroundColor: 'white',
    width: '100%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    color: '#1F2937',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  filterActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterActionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
  },
  applyButton: {
    backgroundColor: '#6A62B7',
    borderColor: '#6A62B7',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editModalContent: {
    padding: 20,
  },
  editModalHeader: {
    marginBottom: 20,
    paddingRight: 24,
  },
  editModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D2B3F',
    marginBottom: 4,
  },
  editModalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
  },
  editModalLocation: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
  },
  editSection: {
    marginBottom: 20,
  },
  editSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  tagsSection: {
    marginTop: 8,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  selectedPredefinedTag: {
    borderWidth: 2,
    borderColor: '#6A62B7',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
  },
  sourceLink: {
    color: '#6A62B7',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#6A62B7',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tagInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  tagInputWithTags: {
    flex: 1,
    minWidth: 80,
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  selectedTagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E1FF',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 5,
  },
  selectedTagText: {
    color: '#6A62B7',
    fontSize: 14,
    marginRight: 5,
  },
  locationFilterTag: {
    backgroundColor: '#3B82F6',  // Different color for location tags
  },
  locationTagItem: {
    backgroundColor: '#DBEAFE',  // Light blue for location tag items
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
}); 