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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Filter, Share as ShareIcon, Plus, X, Edit2, Search, Check } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Location } from '../types/index';
import { LocationCard } from '../components/LocationCard';
import { BoardEditModal } from '../components/BoardEditModal';

type BoardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Board'>;

interface Board {
  id: string;
  name: string;
  emoji?: string;
  locations: Location[];
}

interface RecentBoard {
  id: string;
  name: string;
  locationCount: number;
}

export function BoardScreen() {
  const navigation = useNavigation<BoardScreenNavigationProp>();
  const route = useRoute();
  
  // Mock board data
  const [board, setBoard] = useState<Board>({
    id: '1',
    name: 'Japan Grad Trip! 👘',
    locations: [
      {
        id: '1',
        name: 'Ghibli Museum',
        location: 'Tokyo, Japan',
        category: 'Entertainment',
        isFavorite: false,
        tags: ['Entertainment'],
        editableTags: ['Entertainment'],
        note: null,
        sourceLink: 'https://www.ghibli-museum.jp',
      },
      {
        id: '2',
        name: 'Totoro Cafe',
        location: 'Osaka, Japan',
        category: 'Food',
        isFavorite: false,
        tags: ['Food'],
        editableTags: ['Food'],
        note: null,
        sourceLink: 'https://example.com/totoro-cafe',
      },
      // Add more locations as needed
    ],
  });

  // All available locations for adding to board
  const [allLocations, setAllLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Japan Rail Cafe TOKYO',
      location: 'Osaka, Japan',
      category: 'Food',
      isFavorite: false,
      tags: ['Food'],
      editableTags: ['Food'],
      note: null,
      sourceLink: 'https://www.jrailcafe.com',
    },
    {
      id: '2',
      name: 'SkyTree Cafe 350',
      location: 'Tokyo, Japan',
      category: 'Food',
      isFavorite: false,
      tags: ['Food'],
      editableTags: ['Food'],
      note: null,
      sourceLink: 'https://www.skytree.jp',
    },
    // Add more locations
  ]);

  // State for modals
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isBoardSelectionVisible, setIsBoardSelectionVisible] = useState(false);
  const [isNewBoardModalVisible, setIsNewBoardModalVisible] = useState(false);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    location: string;
    tags: string[];
  }>({ location: '', tags: [] });

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

  // Filter locations based on search query and active filters
  const filteredLocations = board.locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !activeFilters.location || 
      location.location.toLowerCase().includes(activeFilters.location.toLowerCase());
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

  const handleAddLocations = () => {
    const locationsToAdd = allLocations.filter(location => 
      selectedLocationsToAdd.includes(location.id)
    );
    
    setBoard(prev => ({
      ...prev,
      locations: [...prev.locations, ...locationsToAdd],
    }));
    
    setSelectedLocationsToAdd([]);
    setIsAddModalVisible(false);
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

  const handleEditBoard = (data: { name: string; coverImage?: string }) => {
    setBoard(prev => ({
      ...prev,
      name: data.name,
      coverImage: data.coverImage,
    }));
    setIsEditModalVisible(false);
  };

  const handleCreateBoard = (data: { name: string; coverImage?: string }) => {
    const newBoard: RecentBoard = {
      id: Date.now().toString(),
      name: data.name,
      locationCount: 0,
    };
    setRecentBoards(prev => [newBoard, ...prev]);
    setIsNewBoardModalVisible(false);
    // Here you would typically also select the new board and add locations to it
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

      {(activeFilters.tags.length > 0 || activeFilters.location) && (
        <View style={styles.activeFiltersContainer}>
          {activeFilters.location && (
            <TouchableOpacity 
              style={styles.activeFilterTag}
              onPress={() => handleClearFilters()}
            >
              <Text style={styles.activeFilterText}>{activeFilters.location}</Text>
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          {activeFilters.tags.map((tag, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.activeFilterTag}
              onPress={() => {
                setActiveFilters(prev => ({
                  ...prev,
                  tags: prev.tags.filter(t => t !== tag),
                }));
              }}
            >
              <Text style={styles.activeFilterText}>{tag}</Text>
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.clearFiltersButton}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredLocations}
        renderItem={({ item }) => (
          <LocationCard location={item} onEdit={() => {}} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

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
                onPress={handleAddLocations}
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

      {/* Filter Modal - Reuse the same filter modal from AllLocationsScreen */}
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
              />
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
    </SafeAreaView>
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
  clearFiltersButton: {
    marginLeft: 8,
  },
  clearFiltersText: {
    color: '#6A62B7',
    fontSize: 14,
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
  filterSection: {
    marginBottom: 24,
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
}); 