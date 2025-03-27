import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Image,
  Share,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Filter, Share as ShareIcon, Plus, X, Edit2, Search, Check } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Location } from '../types/index';
import { LocationCard } from '../components/LocationCard';
import { BoardEditModal } from '../components/BoardEditModal';
import { PlaceholderImage } from '../components/PlaceholderImage';
import supabase from '../utils/supabaseClient';
import { useToast } from '../hooks/useToast';

type BoardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Board'>;

interface Board {
  id: string;
  name: string;
  emoji?: string;
  locations: Location[];
  coverImage?: string;
}

interface RecentBoard {
  id: string;
  name: string;
  locationCount: number;
}

// Add this constant for predefined tags if it doesn't exist already
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

// Add import for LocationWithEditableContent
interface LocationWithEditableContent extends Location {
  editableTags: string[];
  note: string | null;
}

export function BoardScreen() {
  const navigation = useNavigation<BoardScreenNavigationProp>();
  const route = useRoute();
  const { boardId } = route.params as { boardId: string };
  const { showToast } = useToast();
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);

  // API Integration Comment:
  // When implementing the backend integration, replace the mock data and functions with:
  // 1. Fetch the board data using the boardId from route params
  // useEffect(() => {
  //   const fetchBoardData = async () => {
  //     try {
  //       const response = await api.getBoard(boardId);
  //       setBoard(response.data);
  //     } catch (error) {
  //       console.error('Error fetching board:', error);
  //     }
  //   };
  //
  //   fetchBoardData();
  // }, [boardId]);
  //
  // 2. Update board data using API calls
  // const handleEditBoard = async (data) => {
  //   try {
  //     const response = await api.updateBoard(boardId, data);
  //     setBoard(prev => ({ ...prev, ...response.data }));
  //     setIsEditModalVisible(false);
  //   } catch (error) {
  //     console.error('Error updating board:', error);
  //   }
  // };

  useEffect(() => {
    const fetchBoardData = async () => {
      const { data, error } = await supabase
        .from('boards')
        .select(`
          id,
          name,
          board_location:board_location (
            location:location (
              id,
              name,
              description,
              address,
              country,
              tag
            )
          )
        `)
        .eq('id', boardId)
        .single();

      if (error) {
        console.error('❌ Error fetching board:', error);
      } else {
        setBoard({
          id: data.id,
          name: data.name,
          locations: (data.board_location || [])
            .map(entry => ({
              ...entry.location,
              tags: entry.location?.tag || [],
              editableTags: entry.location?.tag || [],
              note: entry.location?.note || null,
            }))
            .filter(loc => loc), // filter nulls
          coverImage: data.coverImage || '',
        });        
      }
    };
  
    fetchBoardData();
  }, [boardId]);

  const [allLocations, setAllLocations] = useState<Location[]>([]);

  // State for modals
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isBoardSelectionVisible, setIsBoardSelectionVisible] = useState(false);
  const [isNewBoardModalVisible, setIsNewBoardModalVisible] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [locationFilterTags, setLocationFilterTags] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState('');
  const [tagFilterTags, setTagFilterTags] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    location: string;
    tags: string[];
  }>({ location: '', tags: [] });

  useEffect(() => {
    const fetchAllLocations = async () => {
      const { data, error } = await supabase
        .from('location')
        .select('*');
  
      if (error) {
        console.error('Error fetching all locations:', error);
      } else {
        setAllLocations(data);
      }
    };
  
    fetchAllLocations();
  }, []);
  
  // State for location selection
  const [selectedLocationsToAdd, setSelectedLocationsToAdd] = useState<string[]>([]);
  const [selectedLocationsToShare, setSelectedLocationsToShare] = useState<string[]>([]);

  // Add these state variables in the BoardScreen component
  const [recentBoards, setRecentBoards] = useState<RecentBoard[]>([
    {
      id: '2',
      name: 'Europe Summer 2024 🌞',
      locationCount: 8,
    },
    {
      id: '3',
      name: 'Food Spots NYC 🗽',
      locationCount: 15,
    },
    // Add more recent boards
  ]);

  // Add edit location state
  const [currentLocation, setCurrentLocation] = useState<LocationWithEditableContent | null>(null);
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editedNote, setEditedNote] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [board, setBoard] = useState<Board>({
    id: '',
    name: '',
    locations: [],
    coverImage: '',
  });
  
  // Filter locations based on search query and active filters
  const filteredLocations = board.locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // For location, consider it a match if any of the active filter locations are present
    const matchesLocation = !activeFilters.location || 
      (activeFilters.location.split(', ').some(filterLoc => 
        location.location.toLowerCase().includes(filterLoc.toLowerCase())
      ));
    
    const matchesTags = activeFilters.tags.length === 0 || 
      activeFilters.tags.every(tag => location.tags.includes(tag));
    return matchesSearch && matchesLocation && matchesTags;
  });

  // Filter locations for add modal
  const filteredAllLocations = allLocations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !board.locations.some(boardLocation => boardLocation.id === location.id)
  );

  const handleShare = async () => {
    const locationsToShare = board.locations.filter(location => 
      selectedLocationsToShare.includes(location.id)
    );

    const shareText = locationsToShare
      .map(location => `${location.name}\n${location.location}`)
      .join('\n\n');

    try {
      await Share.share({
        message: shareText,
        title: board.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // const handleAddLocations = () => {
  //   const locationsToAdd = allLocations.filter(location => 
  //     selectedLocationsToAdd.includes(location.id)
  //   );
    
  //   setBoard(prev => ({
  //     ...prev,
  //     locations: [...prev.locations, ...locationsToAdd],
  //   }));
    
  //   setSelectedLocationsToAdd([]);
  //   setIsAddModalVisible(false);
  // };

  // Filter functionality update for multiple location tags
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

  const handleAddLocationsToBoard = async () => {
    if (!boardId || selectedLocationsToAdd.length === 0) return;
  
    const entries = selectedLocationsToAdd.map(locationId => ({
      board_id: boardId,
      location_id: locationId,
    }));
  
    console.log('Saving locations to board:', entries); // 🔍 debug
  
    const { error } = await supabase.from('board_location').insert(entries);
  
    if (error) {
      console.error('Error saving to board_location:', error);
      showToast('Failed to save locations');
    } else {
      showToast('Locations added!');
      setShowAddLocationModal(false);
      setSelectedLocationsToAdd([]);
      fetchBoardData(); // refresh the board’s list
    }
    await fetchBoardData();
  };

  const fetchBoardData = async () => {
    try {
      // Get boardId from route or state
      const boardId = route.params?.boardId;
  
      // Fetch board info (like name, location count)
      const { data: board, error: boardError } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .single();
  
      // Fetch associated locations from the junction table
      const { data: boardLocations, error: locationError } = await supabase
        .from('board_location')
        .select('location(*)') // Get location details via foreign key
        .eq('board_id', boardId);
  
      if (boardError || locationError) {
        console.error('Error fetching board data:', boardError || locationError);
        return;
      }
  
      setBoard({
        ...board,
        locations: boardLocations.map(item => ({
          ...item.location,
          editableTags: item.location?.tag || [],
          note: item.location?.note || null,
        })),
      });      
    } catch (err) {
      console.error('Failed to fetch board data', err);
    }
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

  const handleSelectPredefinedTag = (tag: string) => {
    if (!editedTags.includes(tag)) {
      setEditedTags([...editedTags, tag]);
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

  const toggleLocationSelection = (locationId: string, isSharing: boolean) => {
    if (isSharing) {
      setSelectedLocationsToShare(prev => 
        prev.includes(locationId)
          ? prev.filter(id => id !== locationId)
          : [...prev, locationId]
      );
    } else {
      setSelectedLocationsToAdd(prev => 
        prev.includes(locationId)
          ? prev.filter(id => id !== locationId)
          : [...prev, locationId]
      );
    }
  };

  const handleEditBoard = async (data: { name: string; coverImage?: string }) => {
    const { error } = await supabase
      .from('boards')
      .update({ name: data.name, coverImage: data.coverImage })
      .eq('id', boardId);
  
    if (error) {
      console.error('❌ Error updating board:', error);
      return;
    }
  
    setBoard(prev => ({
      ...prev,
      name: data.name,
      coverImage: data.coverImage,
    }));
    setIsEditModalVisible(false);
  };
  

  const handleCreateBoard = async (data: { name: string; coverImage?: string }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    const { error, data: newBoard } = await supabase
      .from('boards')
      .insert([
        {
          name: data.name,
          user: user?.id,
          coverImage: data.coverImage || '#D1D5DB', // 🎨 fallback default color
        },
      ])
      .select()
      .single();
  
    if (error) {
      console.error('Error creating board:', error);
    } else {
      setBoards(prev => [newBoard as Board, ...prev]);
    }
    setIsNewBoardModalVisible(false);
  };

  // Add these functions for the edit modal
  const handleOpenEditModal = (location: Location) => {
    // Convert Location to LocationWithEditableContent
    const editableLocation: LocationWithEditableContent = {
      ...location,
      editableTags: location.tags || [],
      note: location.notes && location.notes.length > 0 ? location.notes[0] : null,
    };
    
    setCurrentLocation(editableLocation);
    setEditedTags(editableLocation.editableTags);
    setEditedNote(editableLocation.note || '');
    setIsEditModalVisible(true);
  };

  const handleSaveLocationEdit = async () => {
    if (!currentLocation) return;
  
    const updatedTags = editedTags;
    const updatedNote = editedNote.trim();
  
    const { error } = await supabase
      .from('location')
      .update({
        tag: updatedTags,
        note: updatedNote || null,
      })
      .eq('id', currentLocation.id);
  
    if (error) {
      console.error('❌ Error saving location:', error);
      return;
    }

    console.log("✅ Saved to Supabase");
  
    // Update local state too
    const updatedLocations = board.locations.map(loc =>
      loc.id === currentLocation.id
        ? { ...loc, tag: updatedTags, note: [updatedNote] }
        : loc
    );
  
    setBoard({ ...board, locations: updatedLocations });
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
  
  const handleLocationPress = (locationId: string) => {
    navigation.navigate('LocationDetails', { locationId });
  };

  // Display active filters below search
  const renderActiveFilters = () => {
    if (activeFilters.tags.length === 0 && !activeFilters.location) return null;
    
    return (
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
    );
  };

  // Add a function to remove filters
  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== filter),
      location: filter === prev.location ? '' : prev.location,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('AllBoards')}>
          <ArrowLeft size={24} color="#2D2B3F" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditModalVisible(true)}
        >
          <Edit2 size={20} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Edit Board</Text>
        </TouchableOpacity>
      </View>
      
      {/* Cover Image */}
      <View style={styles.coverImageContainer}>
        {board.coverImage ? (
          <Image
            source={{ uri: board.coverImage }}
            style={styles.coverImage}
          />
        ) : (
          <View style={[styles.coverPlaceholder, { backgroundColor: '#D1D5DB' /* Default gray */ }]}>
            <Text style={styles.coverPlaceholderEmoji}>
              {board.emoji ?? board.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{board.name}</Text>

      <View style={styles.subHeader}>
        <Text style={styles.sectionTitle}>Locations</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setIsShareModalVisible(true)}
          >
            <ShareIcon size={20} color="#6A62B7" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Plus size={20} color="#6A62B7" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Filter size={20} color="#6A62B7" />
          </TouchableOpacity>
        </View>
      </View>

      {renderActiveFilters()}

      {filteredLocations.length > 0 ? (
        <FlatList
          data={filteredLocations}
          renderItem={({ item }) => (
            <LocationCard 
              location={item}
              onEdit={() => handleOpenEditModal(item)}
              onPress={() => handleLocationPress(item.id)}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No location results</Text>
        </View>
      )}

      {/* Add Locations Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add locations to board</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setIsAddModalVisible(false);
                  setSelectedLocationsToAdd([]);
                }}
              >
                <X size={24} color="#2D2B3F" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search size={20} color="#6B7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <ScrollView style={styles.modalList}>
              {filteredAllLocations.map(location => (
                <TouchableOpacity
                  key={location.id}
                  style={styles.locationItem}
                  onPress={() => toggleLocationSelection(location.id, false)}
                >
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.locationAddress}>{location.location}</Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedLocationsToAdd.includes(location.id) && styles.checkboxSelected
                  ]}>
                    {selectedLocationsToAdd.includes(location.id) && (
                      <Check size={16} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsAddModalVisible(false);
                  setSelectedLocationsToAdd([]);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  selectedLocationsToAdd.length === 0 && styles.addButtonDisabled
                ]}
                onPress={handleAddLocationsToBoard}
                disabled={selectedLocationsToAdd.length === 0}
              >
                <Text style={styles.addButtonText}>
                  Add ({selectedLocationsToAdd.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal
        visible={isShareModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Export</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setIsShareModalVisible(false);
                  setSelectedLocationsToShare([]);
                }}
              >
                <X size={24} color="#2D2B3F" />
              </TouchableOpacity>
            </View>

            <View style={styles.shareOptions}>
              <View style={styles.shareOptionsRow}>
                <TouchableOpacity style={styles.shareOption}>
                  <View style={styles.shareIconContainer}>
                    <ShareIcon size={24} color="#6A62B7" />
                  </View>
                  <Text style={styles.shareOptionText}>AirDrop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption}>
                  <View style={styles.shareIconContainer}>
                    <ShareIcon size={24} color="#6A62B7" />
                  </View>
                  <Text style={styles.shareOptionText}>Telegram</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption}>
                  <View style={styles.shareIconContainer}>
                    <ShareIcon size={24} color="#6A62B7" />
                  </View>
                  <Text style={styles.shareOptionText}>Wanderlog</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption}>
                  <View style={styles.shareIconContainer}>
                    <ShareIcon size={24} color="#6A62B7" />
                  </View>
                  <Text style={styles.shareOptionText}>Google Maps</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.copyButton}>
              <Text style={styles.copyButtonText}>Copy</Text>
              <View style={styles.copyIcon}>
                <ShareIcon size={20} color="#6A62B7" />
              </View>
            </TouchableOpacity>

            <View style={styles.shareSection}>
              <Text style={styles.shareSectionTitle}>Select locations to share:</Text>
              <ScrollView style={styles.modalList}>
                {board.locations.map(location => (
                  <TouchableOpacity
                    key={location.id}
                    style={styles.locationItem}
                    onPress={() => toggleLocationSelection(location.id, true)}
                  >
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{location.name}</Text>
                      <Text style={styles.locationAddress}>{location.location}</Text>
                    </View>
                    <View style={[
                      styles.checkbox,
                      selectedLocationsToShare.includes(location.id) && styles.checkboxSelected
                    ]}>
                      {selectedLocationsToShare.includes(location.id) && (
                        <Check size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[
                styles.shareButton,
                selectedLocationsToShare.length === 0 && styles.shareButtonDisabled
              ]}
              onPress={handleShare}
              disabled={selectedLocationsToShare.length === 0}
            >
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

      <BoardEditModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleEditBoard}
        initialData={{
          name: board.name,
          coverImage: board.coverImage,
        }}
        mode="edit"
      />

      <Modal
        visible={isBoardSelectionVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to board</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsBoardSelectionVisible(false)}
              >
                <X size={24} color="#2D2B3F" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search size={20} color="#6B7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search boards"
                  placeholderTextColor="#6B7280"
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Recently accessed</Text>
            <ScrollView style={styles.recentBoardsContainer}>
              {recentBoards.map(board => (
                <TouchableOpacity
                  key={board.id}
                  style={styles.boardItem}
                  onPress={() => {
                    // Handle board selection
                    setIsBoardSelectionVisible(false);
                  }}
                >
                  <View style={styles.boardInfo}>
                    <Text style={styles.boardName}>{board.name}</Text>
                    <Text style={styles.locationCount}>
                      {board.locationCount} {board.locationCount === 1 ? 'location' : 'locations'}
                    </Text>
                  </View>
                  <View style={styles.checkbox} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>All boards</Text>
            <ScrollView style={styles.allBoardsContainer}>
              {recentBoards.concat([
                {
                  id: '4',
                  name: 'Hidden Gems in Tokyo 💎',
                  locationCount: 5,
                },
                {
                  id: '5',
                  name: 'Best Coffee Shops ☕',
                  locationCount: 7,
                }
              ]).map(board => (
                <TouchableOpacity
                  key={board.id}
                  style={styles.boardItem}
                  onPress={() => {
                    // Handle board selection
                    setIsBoardSelectionVisible(false);
                  }}
                >
                  <View style={styles.boardInfo}>
                    <Text style={styles.boardName}>{board.name}</Text>
                    <Text style={styles.locationCount}>
                      {board.locationCount} {board.locationCount === 1 ? 'location' : 'locations'}
                    </Text>
                  </View>
                  <View style={styles.checkbox} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.newBoardButton}
              onPress={() => {
                setIsBoardSelectionVisible(false);
                setIsNewBoardModalVisible(true);
              }}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.newBoardButtonText}>New board</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => setIsBoardSelectionVisible(false)}
            >
              <Text style={styles.skipButtonText}>No thanks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BoardEditModal
        visible={isNewBoardModalVisible}
        onClose={() => setIsNewBoardModalVisible(false)}
        onSave={handleCreateBoard}
        mode="create"
      />

      {/* Add the Edit Location Modal */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A62B7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2D2B3F',
    padding: 16,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D2B3F',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
  },
  listContent: {
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D2B3F',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
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
  modalList: {
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locationInfo: {
    flex: 1,
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
  },
  locationFilterTag: {
    backgroundColor: '#DBEAFE', // Light blue, like used for location tags
  },  
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6A62B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#6A62B7',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#6A62B7',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginLeft: 12,
  },
  addButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  shareOptions: {
    marginBottom: 24,
  },
  shareOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shareOption: {
    alignItems: 'center',
  },
  shareIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  shareOptionText: {
    fontSize: 12,
    color: '#2D2B3F',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 24,
  },
  copyButtonText: {
    fontSize: 16,
    color: '#2D2B3F',
  },
  copyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareSection: {
    flex: 1,
  },
  shareSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2B3F',
    marginBottom: 16,
  },
  shareButton: {
    backgroundColor: '#6A62B7',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  shareButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
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
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 10,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  tagItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#1F2937',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  filterActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6A62B7',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  filterActionButtonText: {
    color: '#6A62B7',
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#6A62B7',
    borderColor: '#6A62B7',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
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
  selectedPredefinedTag: {
    borderWidth: 2,
    borderColor: '#6A62B7',
  },
  recentBoardsContainer: {
    maxHeight: 200,
    marginBottom: 16,
  },
  boardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  boardInfo: {
    flex: 1,
  },
  boardName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2B3F',
    marginBottom: 4,
  },
  locationCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  newBoardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A62B7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  newBoardButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  allBoardsContainer: {
    maxHeight: 200,
    marginBottom: 16,
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
  noteInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
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
  coverImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  coverPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  coverPlaceholderEmoji: {
    fontSize: 48,
    color: '#6B7280',
  },
}); 