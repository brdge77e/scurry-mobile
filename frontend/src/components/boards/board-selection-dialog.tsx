import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Board } from '../../types';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../../hooks/use-toast';

interface BoardSelectionDialogProps {
  boards: Board[];
  visible: boolean;
  onClose: () => void;
  onSelectBoards: (boardIds: string[]) => Promise<void>;
  isLoading?: boolean;
}

export function BoardSelectionDialog({
  boards,
  visible,
  onClose,
  onSelectBoards,
  isLoading = false,
}: BoardSelectionDialogProps) {
  const { toast } = useToast();
  const [selectedBoardIds, setSelectedBoardIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleBoard = (boardId: string) => {
    setSelectedBoardIds((prev) =>
      prev.includes(boardId)
        ? prev.filter((id) => id !== boardId)
        : [...prev, boardId]
    );
  };

  const handleSelectAll = () => {
    setSelectedBoardIds(boards.map((board) => board.id));
  };

  const handleDeselectAll = () => {
    setSelectedBoardIds([]);
  };

  const handleSubmit = async () => {
    if (selectedBoardIds.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one board',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSelectBoards(selectedBoardIds);
      onClose();
      toast({
        title: 'Success',
        description: 'Locations added to selected boards',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add locations to boards',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Boards</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.selectAllContainer}>
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={
                selectedBoardIds.length === boards.length
                  ? handleDeselectAll
                  : handleSelectAll
              }
            >
              <Checkbox
                checked={selectedBoardIds.length === boards.length}
                onCheckedChange={
                  selectedBoardIds.length === boards.length
                    ? handleDeselectAll
                    : handleSelectAll
                }
              />
              <Text style={styles.selectAllText}>
                {selectedBoardIds.length === boards.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.count}>
              {selectedBoardIds.length} of {boards.length} selected
            </Text>
          </View>

          <ScrollView style={styles.content}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : boards.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No boards available</Text>
              </View>
            ) : (
              boards.map((board) => (
                <TouchableOpacity
                  key={board.id}
                  style={styles.boardItem}
                  onPress={() => handleToggleBoard(board.id)}
                >
                  <View style={styles.boardContent}>
                    <View style={styles.boardInfo}>
                      <Text style={styles.boardName}>{board.name}</Text>
                      <Text style={styles.boardDescription}>
                        {board.description}
                      </Text>
                    </View>
                    <Checkbox
                      checked={selectedBoardIds.includes(board.id)}
                      onCheckedChange={() => handleToggleBoard(board.id)}
                    />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={isSubmitting || selectedBoardIds.length === 0}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Adding...' : 'Add to Boards'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
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
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
  },
  selectAllContainer: {
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
  content: {
    flex: 1,
  },
  boardItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  boardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boardInfo: {
    flex: 1,
    marginRight: 16,
  },
  boardName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  boardDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
}); 