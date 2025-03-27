import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Plus, X, Edit2, Trash2, Check } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../types/navigation';
import { useToast } from '../hooks/useToast';
import { Location } from '../types/index';
import { BoardEditModal } from '../components/BoardEditModal';
import supabase from '../utils/supabaseClient';

type SelectedLocationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectedLocations'> & 
  NativeStackNavigationProp<MainTabParamList>;

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

interface Board {
  id: string;
  name: string;
  emoji?: string;
  locationCount: number;
  lastAccessed?: Date;
}

export function SelectedLocationsScreen() {
  const navigation = useNavigation<SelectedLocationsScreenNavigationProp>();
  const route = useRoute();
  const { showToast } = useToast();
  const sourceLink = (route.params as { sourceLink: string })?.sourceLink;
  
  useEffect(() => {
    const fetchBoards = async () => {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .order('lastAccessed', { ascending: false });

      if (error) console.error('Error fetching boards:', error);
      else setBoards(data);
    };
    fetchBoards();
  }, []);
  // API Integration Comments:
  // This screen handles newly extracted locations and provides options to save them
  // The implementation should include these API calls:
  //
  // 1. Saving locations to the central list:
  // When locations are extracted or created, they should be saved to the backend
  // const saveLocations = async (newLocations) => {
  //   try {
  //     const savedLocations = await api.saveLocations(newLocations);
  //     setLocations(savedLocations);
  //     // Display success toast
  //     showToast('Locations saved successfully!');
  //   } catch (error) {
  //     console.error('Error saving locations:', error);
  //     // Display error toast
  //     showToast('Failed to save locations. Please try again.');
  //   }
  // };
  //
  // 2. Fetching available boards to add locations to:
  // useEffect(() => {
  //   const fetchBoards = async () => {
  //     try {
  //       const response = await api.getBoards();
  //       setBoards(response.data);
  //     } catch (error) {
  //       console.error('Error fetching boards:', error);
  //     }
  //   };
  //
  //   fetchBoards();
  // }, []);
  //
  // 3. Adding locations to a selected board:
  // const addLocationsToBoard = async (boardId, locationIds) => {
  //   try {
  //     await api.addLocationsToBoard(boardId, locationIds);
  //     // Display success toast
  //     showToast('Locations added to board!');
  //     navigation.navigate('Board', { boardId });
  //   } catch (error) {
  //     console.error('Error adding locations to board:', error);
  //     // Display error toast
  //     showToast('Failed to add locations to board. Please try again.');
  //   }
  // };
  //
  // 4. Creating a new board and adding locations to it:
  // const createBoardAndAddLocations = async (boardData, locationIds) => {
  //   try {
  //     const newBoard = await api.createBoard(boardData);
  //     await api.addLocationsToBoard(newBoard.id, locationIds);
  //     // Display success toast
  //     showToast(`Board "${boardData.name}" created with locations!`);
  //     navigation.navigate('Board', { boardId: newBoard.id });
  //   } catch (error) {
  //     console.error('Error creating board with locations:', error);
  //     // Display error toast
  //     showToast('Failed to create board. Please try again.');
  //   }
  // };
  
  // State for locations
  const [locations, setLocations] = useState<LocationWithEditableContent[]>([
    {
      id: '1',
      name: 'Totoro Cafe',
      location: 'Osaka, Japan',
      imageSrc: 'https://example.com/totoro.jpg',
      category: 'Cafe',
      isFavorite: false,
      tags: [],
      editableTags: [],
      note: null,
      sourceLink: sourceLink,
    },
    {
      id: '2',
      name: 'Times Square',
      location: 'New York, NY',
      imageSrc: 'https://example.com/times-square.jpg',
      category: 'Landmark',
      isFavorite: false,
      tags: [],
      editableTags: [],
      note: null,
      sourceLink: sourceLink,
    },
  ]);

  // Tag modal state
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [tagsToAdd, setTagsToAdd] = useState<string[]>([]);
  const inputRef = useRef<TextInput>(null);

  // Note modal state
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  
  // Board selection modal state
  const [isBoardModalVisible, setIsBoardModalVisible] = useState(false);
  const [boards, setBoards] = useState<Board[]>([
    {
      id: '1',
      name: 'Japan Grad Trip! 📍',
      locationCount: 7,
      lastAccessed: new Date(),
    },
    {
      id: '2',
      name: 'Hangouts~~',
      locationCount: 7,
      lastAccessed: new Date(),
    },
    {
      id: '3',
      name: 'Food Spots NYC 🗽',
      locationCount: 15,
      lastAccessed: new Date(Date.now() - 86400000 * 3), // 3 days ago
    },
    {
      id: '4',
      name: 'Europe Summer 2024 🌞',
      locationCount: 8,
      lastAccessed: new Date(Date.now() - 86400000 * 5), // 5 days ago
    },
  ]);

  // Add state for board search functionality
  const [boardSearchQuery, setBoardSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [isNewBoardModalVisible, setIsNewBoardModalVisible] = useState(false);

  // Get recent boards (last accessed within a week)
  const recentBoards = boards
    .filter(board => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return board.lastAccessed && board.lastAccessed > oneWeekAgo;
    })
    .sort((a, b) => {
      return (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0);
    })
    .slice(0, 3); // Get top 3 recent boards instead of 5

  // Get all boards filtered by search query
  const filteredBoards = boards.filter(board => 
    board.name.toLowerCase().includes(boardSearchQuery.toLowerCase())
  );

  const handleLocationPress = (locationId: string) => {
    navigation.navigate('LocationDetails', { locationId });
  };

  const openTagModal = (locationId: string) => {
    setCurrentLocationId(locationId);
    setIsTagModalVisible(true);
    // Reset tag input and tags to add when opening modal
    setTagInput('');
    setTagsToAdd([]);
    // Show suggestions after a short delay to ensure modal is fully visible
    setTimeout(() => {
      setShowTagSuggestions(true);
      inputRef.current?.focus();
    }, 300);
  };

  const closeTagModal = () => {
    setIsTagModalVisible(false);
    setShowTagSuggestions(false);
    setCurrentLocationId(null);
    setTagsToAdd([]);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = tagInput.trim();
    // Check if tag is already in the list to add
    if (!tagsToAdd.includes(newTag) && 
        !getCurrentLocationTags().includes(newTag)) {
      setTagsToAdd([...tagsToAdd, newTag]);
    }
    setTagInput('');
  };

  const handleSaveTags = () => {
    if (!currentLocationId || tagsToAdd.length === 0) return;

    const updatedLocations = locations.map(location => {
      if (location.id === currentLocationId) {
        return {
          ...location,
          editableTags: [...location.editableTags, ...tagsToAdd],
        };
      }
      return location;
    });

    setLocations(updatedLocations);
    // Show a toast to confirm tags were added
    showToast(`${tagsToAdd.length} tag${tagsToAdd.length > 1 ? 's' : ''} added`);
    closeTagModal();
  };

  const handleSelectPredefinedTag = (tag: string) => {
    // Check if tag is already in the list to add or in current location tags
    if (!tagsToAdd.includes(tag) && !getCurrentLocationTags().includes(tag)) {
      setTagsToAdd([...tagsToAdd, tag]);
    }
  };

  const handleRemoveTagToAdd = (tagToRemove: string) => {
    setTagsToAdd(tagsToAdd.filter(tag => tag !== tagToRemove));
  };

  const handleRemoveTag = (locationId: string, tagToRemove: string) => {
    const updatedLocations = locations.map(location => {
      if (location.id === locationId) {
        return {
          ...location,
          editableTags: location.editableTags.filter(tag => tag !== tagToRemove),
        };
      }
      return location;
    });

    setLocations(updatedLocations);
  };

  const handleTagInputSubmit = () => {
    if (tagInput.trim()) {
      handleAddTag();
    }
  };

  const handleOpenNoteModal = (locationId: string) => {
    setCurrentLocationId(locationId);
    const location = locations.find(loc => loc.id === locationId);
    setNoteInput(location?.note || '');
    setIsNoteModalVisible(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalVisible(false);
    setCurrentLocationId(null);
    setNoteInput('');
  };

  const handleSaveNote = () => {
    if (!currentLocationId) return;

    const updatedLocations = locations.map(location => {
      if (location.id === currentLocationId) {
        return {
          ...location,
          note: noteInput.trim(),
        };
      }
      return location;
    });

    setLocations(updatedLocations);
    closeNoteModal();
  };

  const handleDeleteNote = (locationId: string) => {
    const updatedLocations = locations.map(location => {
      if (location.id === locationId) {
        return {
          ...location,
          note: null,
        };
      }
      return location;
    });

    setLocations(updatedLocations);
  };

  const handleConfirm = () => {
    setIsBoardModalVisible(true);
  };

  const handleAddToBoard = (boardId: string) => {
    // Here you would implement the logic to save locations to the selected board
    // and update the general locations list
    showToast('Locations added to board successfully!');
    setIsBoardModalVisible(false);
    navigation.navigate('Board', { boardId });
  };

  const handleNoThanks = () => {
    // Save locations to the general list only without adding to any board
    showToast('Locations saved successfully!');
    setIsBoardModalVisible(false);
    navigation.navigate('AllLocations');
  };

  const handleCreateNewBoard = (data: { name: string; coverImage?: string }) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      name: data.name,
      locationCount: 0,
      lastAccessed: new Date(),
    };
    
    // Add the new board to the boards list
    setBoards(prev => [newBoard, ...prev]);
    
    // Select the newly created board
    setSelectedBoard(newBoard.id);
    
    // Close only the new board modal, not the board selection modal
    setIsNewBoardModalVisible(false);
    
    // Show a toast notification
    showToast(`Board "${data.name}" created`);
  };

  const filteredTags = PREDEFINED_TAGS.filter(
    tag => !locations.find(loc => loc.id === currentLocationId)?.editableTags.includes(tag)
  );

  // Add this function to get current location tags
  const getCurrentLocationTags = () => {
    if (!currentLocationId) return [];
    const currentLocation = locations.find(loc => loc.id === currentLocationId);
    return currentLocation ? currentLocation.editableTags : [];
  };

  const renderLocationItem = ({ item }: { item: LocationWithEditableContent }) => (
    <View style={styles.locationCard}>
      <TouchableOpacity 
        style={styles.locationHeader}
        onPress={() => handleLocationPress(item.id)}
      >
        <View>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.locationAddress}>{item.location}</Text>
          <Text style={styles.locationCategory}>{item.category}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.tagsContainer}>
        {item.editableTags.map((tag, index) => (
          <View key={index} style={[styles.tagItem, { backgroundColor: getTagColor(tag) }]}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity 
              style={styles.removeTagButton}
              onPress={() => handleRemoveTag(item.id, tag)}
            >
              <X size={12} color="#6A62B7" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {item.note && (
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>{item.note}</Text>
          <View style={styles.noteActions}>
            <TouchableOpacity 
              onPress={() => handleOpenNoteModal(item.id)}
              style={styles.noteActionButton}
            >
              <Edit2 size={16} color="#6A62B7" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDeleteNote(item.id)}
              style={styles.noteActionButton}
            >
              <Trash2 size={16} color="#6A62B7" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => openTagModal(item.id)}
        >
          <Plus size={16} color="#6A62B7" />
          <Text style={styles.actionButtonText}>Add Tag</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleOpenNoteModal(item.id)}
        >
          <Plus size={16} color="#6A62B7" />
          <Text style={styles.actionButtonText}>Add Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#6A62B7" />
        </TouchableOpacity>
        <Text style={styles.title}>Selected Locations</Text>
      </View>

      <FlatList
        data={locations}
        renderItem={renderLocationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConfirm}
        >
          <Text style={styles.primaryButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      {/* Tag Modal */}
      <Modal
        visible={isTagModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeTagModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1}
            onPress={closeTagModal}
          />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Tag(s)</Text>
              <TouchableOpacity onPress={closeTagModal}>
                <X size={24} color="#2D2B3F" />
              </TouchableOpacity>
            </View>

            {/* Display currently added tags */}
            {getCurrentLocationTags().length > 0 && (
              <View style={styles.currentTagsContainer}>
                <Text style={styles.currentTagsTitle}>Current Tags:</Text>
                <View style={styles.currentTagsList}>
                  {getCurrentLocationTags().map((tag, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.tagItem,
                        { backgroundColor: getTagColor(tag) }
                      ]}
                    >
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Display tags to be added */}
            {tagsToAdd.length > 0 && (
              <View style={styles.currentTagsContainer}>
                <Text style={styles.currentTagsTitle}>Tags to add:</Text>
                <View style={styles.currentTagsList}>
                  {tagsToAdd.map((tag, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.tagItem,
                        { backgroundColor: getTagColor(tag) }
                      ]}
                    >
                      <Text style={styles.tagText}>{tag}</Text>
                      <TouchableOpacity 
                        style={styles.removeTagButton}
                        onPress={() => handleRemoveTagToAdd(tag)}
                      >
                        <X size={12} color="#6A62B7" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.tagInputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.tagInput}
                placeholder="Enter tag"
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleTagInputSubmit}
                returnKeyType="done"
                onFocus={() => setShowTagSuggestions(true)}
              />
            </View>

            {showTagSuggestions && (
              <View style={styles.tagsSection}>
                <Text style={styles.tagsSectionTitle}>Suggested Tags</Text>
                <ScrollView style={styles.tagsList}>
                  <View style={styles.tagsGrid}>
                    {PREDEFINED_TAGS
                      .filter(tag => 
                        !getCurrentLocationTags().includes(tag) && 
                        !tagsToAdd.includes(tag)
                      )
                      .map((tag, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.tagSuggestion,
                            { backgroundColor: getTagColor(tag) }
                          ]}
                          onPress={() => handleSelectPredefinedTag(tag)}
                        >
                          <Text style={styles.tagSuggestionText}>{tag}</Text>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              style={styles.addTagButton}
              onPress={handleSaveTags}
            >
              <Text style={styles.addTagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Note Modal */}
      <Modal
        visible={isNoteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeNoteModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1}
            onPress={closeNoteModal}
          />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Note</Text>
              <TouchableOpacity onPress={closeNoteModal}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.noteInput}
              placeholder="Enter your note here..."
              placeholderTextColor="#6B7280"
              value={noteInput}
              onChangeText={setNoteInput}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.addTagButton}
              onPress={handleSaveNote}
              disabled={!noteInput.trim()}
            >
              <Text style={styles.addTagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Board Selection Modal */}
      <Modal
        transparent
        visible={isBoardModalVisible}
        animationType="fade"
        onRequestClose={() => setIsBoardModalVisible(false)}
      >
        <View style={styles.boardModalContainer}>
          <View style={styles.boardModalContent}>
            <View style={styles.boardModalHeader}>
              <Text style={styles.boardModalTitle}>Location saved</Text>
              <Text style={styles.boardModalSubtitle}>You can also add it to a board</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsBoardModalVisible(false)}
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search boards"
                value={boardSearchQuery}
                onChangeText={setBoardSearchQuery}
              />
            </View>

            {/* Recent boards section */}
            <View style={styles.boardSectionContainer}>
              <Text style={styles.boardSectionTitle}>Recently accessed</Text>
              <View style={styles.boardListContainer}>
                {recentBoards.length > 0 ? (
                  <FlatList
                    data={recentBoards}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.boardItem,
                          selectedBoard === item.id && styles.selectedBoardItem,
                        ]}
                        onPress={() => setSelectedBoard(item.id)}
                      >
                        <View style={styles.boardItemContent}>
                          <Text style={styles.boardName}>{item.name}</Text>
                          <Text style={styles.boardCount}>{item.locationCount} locations</Text>
                        </View>
                        {selectedBoard === item.id && (
                          <Check size={20} color="#6A62B7" />
                        )}
                      </TouchableOpacity>
                    )}
                    style={styles.boardList}
                  />
                ) : (
                  <Text style={styles.emptyText}>No recent boards</Text>
                )}
              </View>
            </View>

            {/* All boards section */}
            <View style={styles.boardSectionContainer}>
              <Text style={styles.boardSectionTitle}>All boards</Text>
              <View style={styles.boardListContainer}>
                {filteredBoards.length > 0 ? (
                  <FlatList
                    data={filteredBoards}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.boardItem,
                          selectedBoard === item.id && styles.selectedBoardItem,
                        ]}
                        onPress={() => setSelectedBoard(item.id)}
                      >
                        <View style={styles.boardItemContent}>
                          <Text style={styles.boardName}>{item.name}</Text>
                          <Text style={styles.boardCount}>{item.locationCount} locations</Text>
                        </View>
                        {selectedBoard === item.id && (
                          <Check size={20} color="#6A62B7" />
                        )}
                      </TouchableOpacity>
                    )}
                    style={styles.boardList}
                  />
                ) : (
                  <Text style={styles.emptyText}>No boards matching your search</Text>
                )}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.createBoardButton}
                onPress={() => {
                  // Just open the new board modal without closing the current one
                  setIsNewBoardModalVisible(true);
                }}
              >
                <Plus size={20} color="#6A62B7" />
                <Text style={styles.createBoardText}>Create a new board</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.noThanksButton}
                onPress={handleNoThanks}
              >
                <Text style={styles.noThanksText}>No thanks</Text>
              </TouchableOpacity>
              
              {selectedBoard && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => {
                    handleAddToBoard(selectedBoard);
                    setIsBoardModalVisible(false);
                    setSelectedBoard(null);
                    showToast('Location added to board!');
                  }}
                >
                  <Text style={styles.primaryButtonText}>Confirm</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* New Board Modal */}
      <BoardEditModal
        visible={isNewBoardModalVisible}
        onClose={() => setIsNewBoardModalVisible(false)}
        onSave={handleCreateNewBoard}
        mode="create"
      />
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D2B3F',
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
    marginBottom: 4,
  },
  locationCategory: {
    fontSize: 16,
    color: '#6B7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E1FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#1F2937',
    marginRight: 4,
  },
  removeTagButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6A62B7',
    marginLeft: 4,
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#6A62B7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#6A62B7',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tagInputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  tagInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    width: '100%',
  },
  tagsSection: {
    width: '100%',
    marginBottom: 24,
  },
  tagsSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tagsList: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagSuggestion: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  tagSuggestionText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  addTagButton: {
    backgroundColor: '#6A62B7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  addTagButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  noteContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#4B5563',
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  noteActionButton: {
    padding: 4,
    marginLeft: 12,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    height: 120,
    width: '100%',
    fontSize: 16,
    color: '#2D2B3F',
    marginBottom: 24,
  },
  boardModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  boardModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: '85%',
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  boardModalHeader: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  boardModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  boardModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 4,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  boardSectionContainer: {
    marginBottom: 16,
  },
  boardSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  boardListContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    height: 160, // Increased height for better visibility
  },
  boardList: {
    flex: 1,
  },
  boardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedBoardItem: {
    backgroundColor: '#EDE9FE',
  },
  boardItemContent: {
    flex: 1,
  },
  boardName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  boardCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyText: {
    padding: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalActions: {
    marginTop: 16,
    flexDirection: 'column',  // Changed from row to column
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBoardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,  // Add margin between buttons
    width: '100%',     // Make button take full width
    justifyContent: 'center',
  },
  createBoardText: {
    color: '#6A62B7',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  noThanksButton: {
    marginBottom: 12,  // Add margin between buttons
    width: '100%',     // Make button take full width
    alignItems: 'center',
  },
  noThanksText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  currentTagsContainer: {
    marginBottom: 12,
  },
  currentTagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  currentTagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  // Tag modal styles
  disabledButton: {
    opacity: 0.6,
  },
}); 