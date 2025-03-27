import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal } from '../ui/modal';

interface NoteDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
  locationName: string;
  initialNote?: string;
  isEditing?: boolean;
}

export function NoteDialog({
  visible,
  onClose,
  onSubmit,
  locationName,
  initialNote = '',
  isEditing = false,
}: NoteDialogProps) {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (visible && initialNote) {
      setNote(initialNote);
    } else if (visible && !initialNote) {
      setNote('');
    }
  }, [visible, initialNote]);

  const handleSubmit = () => {
    if (note.trim()) {
      onSubmit(note.trim());
      onClose();
    }
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isEditing ? 'Edit Note' : 'Add Note'}
        </Text>
        
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={set}
          placeholder="Enter your note here..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={!note.trim()}
          >
            <Text style={[
              styles.submitButtonText,
              !note.trim() && styles.submitButtonTextDisabled
            ]}>
              {isEditing ? 'Update' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#403A7A',
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    padding: 16,
    borderRadius: 8,
    minHeight: 100,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#9B87F5',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonTextDisabled: {
    opacity: 0.5,
  },
}); 