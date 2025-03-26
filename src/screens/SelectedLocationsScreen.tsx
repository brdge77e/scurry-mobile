import React, { useState, useRef } from 'react';
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
import { RootStackParamList } from '../types/navigation';
import { useToast } from '../hooks/useToast';
import { Location } from '../types/index';
import { BoardEditModal } from '../components/BoardEditModal';

type SelectedLocationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectedLocations'>;

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
    .slice(0, 5); // Get top 5 recent boards

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
    // Reset tag input when opening modal
    setTagInput('');
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
  };

  const handleAddTag = () => {
    if (!currentLocationId || !tagInput.trim()) return;

    const updatedLocations = locations.map(location => {
      if (location.id === currentLocationId) {
        // Check if tag already exists (case insensitive)
        const tagExists = location.editableTags.some(
          tag => tag.toLowerCase() === tagInput.trim().toLowerCase()
        );

        if (!tagExists) {
          return {
            ...location,
            editableTags: [...location.editableTags, tagInput.trim()],
          };
        }
      }
      return location;
    });

    setLocations(updatedLocations);
    setTagInput('');
  };

  const handleSelectPredefinedTag = (tag: string) => {
    if (!currentLocationId) return;

    const updatedLocations = locations.map(location => {
      if (location.id === currentLocationId) {
        // Check if tag already exists (case insensitive)
        const tagExists = location.editableTags.some(
          existingTag => existingTag.toLowerCase() === tag.toLowerCase()
        );

        if (!tagExists) {
          return {
            ...location,
            editableTags: [...location.editableTags, tag],
          };
        }
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
    // Here you would implement the logic to save locations to the general list only
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
    setBoards(prev => [newBoard, ...prev]);
    setSelectedBoard(newBoard.id);
    setIsNewBoardModalVisible(false);
  };

  const filteredTags = PREDEFINED_TAGS.filter(
    tag => !locations.find(loc => loc.id === currentLocationId)?.editableTags.includes(tag)
  );

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
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
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
                <Text style={styles.tagsSectionTitle}>Tags</Text>
                <ScrollView style={styles.tagsList}>
                  <View style={styles.tagsGrid}>
                    {filteredTags.map((tag, index) => (
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
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              style={styles.addTagButton}
              onPress={handleAddTag}
              disabled={!tagInput.trim()}
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
              style={styles.addButton}
              onPress={handleSaveNote}
              disabled={!noteInput.trim()}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Board Selection Modal */}
      <Modal
        visible={isBoardModalVisible}
        animationType="slide"
        transparent={true}
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
                <X size={24} color="#2D2B3F" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search collections"
                placeholderTextColor="#6B7280"
                value={boardSearchQuery}
                onChangeText={setBoardSearchQuery}
              />
            </View>

            <View style={styles.boardsSection}>
              <Text style={styles.boardsSectionTitle}>Recently Accessed</Text>
              <ScrollView style={styles.boardsList}>
                {recentBoards.map(board => (
                  <TouchableOpacity
                    key={board.id}
                    style={[
                      styles.boardItem,
                      selectedBoard === board.id && styles.boardItemSelected
                    ]}
                    onPress={() => setSelectedBoard(board.id)}
                  >
                    <View style={styles.boardInfo}>
                      <Text style={styles.boardName}>{board.name}</Text>
                      <Text style={styles.boardCount}>{board.locationCount} Locations Saved</Text>
                    </View>
                    {selectedBoard === board.id && (
                      <View style={styles.checkmark}>
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <Text style={[styles.boardsSectionTitle, { marginTop: 16 }]}>All Boards</Text>
              <ScrollView style={styles.boardsList}>
                {filteredBoards.map(board => (
                  <TouchableOpacity
                    key={board.id}
                    style={[
                      styles.boardItem,
                      selectedBoard === board.id && styles.boardItemSelected
                    ]}
                    onPress={() => setSelectedBoard(board.id)}
                  >
                    <View style={styles.boardInfo}>
                      <Text style={styles.boardName}>{board.name}</Text>
                      <Text style={styles.boardCount}>{board.locationCount} Locations Saved</Text>
                    </View>
                    {selectedBoard === board.id && (
                      <View style={styles.checkmark}>
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.newBoardButton}
              onPress={() => {
                setIsNewBoardModalVisible(true);
              }}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.newBoardButtonText}>New board</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                !selectedBoard && styles.saveButtonDisabled
              ]}
              disabled={!selectedBoard}
              onPress={() => {
                if (selectedBoard) {
                  handleAddToBoard(selectedBoard);
                }
              }}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.noThanksButton}
              onPress={handleNoThanks}
            >
              <Text style={styles.noThanksButtonText}>No thanks</Text>
            </TouchableOpacity>
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
    color: '#6A62B7',
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
  confirmButton: {
    backgroundColor: '#6A62B7',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 32,
    width: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
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
    color: '#2D2B3F',
    fontWeight: '500',
  },
  addTagButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    width: 100,
  },
  addTagButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6A62B7',
    textAlign: 'center',
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
    justifyContent: 'flex-end',
  },
  boardModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: '60%',
  },
  boardModalHeader: {
    marginBottom: 24,
  },
  boardModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D2B3F',
    marginBottom: 4,
  },
  boardModalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  boardsSection: {
    flex: 1,
  },
  boardsSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2B3F',
    marginBottom: 16,
  },
  boardsList: {
    maxHeight: 300,
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
  boardCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  newBoardButton: {
    backgroundColor: '#6A62B7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  newBoardButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  noThanksButton: {
    padding: 16,
    alignItems: 'center',
  },
  noThanksButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
  boardItemSelected: {
    backgroundColor: '#F3F4F6',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6A62B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#6A62B7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#A5A5A5',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 