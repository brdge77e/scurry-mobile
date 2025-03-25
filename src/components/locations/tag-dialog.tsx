import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Modal } from '../ui/modal';
import { X } from 'lucide-react-native';

interface TagDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (tags: string[]) => void;
  initialTags?: string[];
}

export function TagDialog({
  visible,
  onClose,
  onSubmit,
  initialTags = [],
}: TagDialogProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (visible && initialTags.length > 0) {
      setTags(initialTags);
    } else if (visible && initialTags.length === 0) {
      setTags([]);
    }
  }, [visible, initialTags]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    onSubmit(tags);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Tags</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTag}
            onChangeText={setNewTag}
            placeholder="Enter a tag..."
            onSubmitEditing={handleAddTag}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTag}
            disabled={!newTag.trim()}
          >
            <Text style={[
              styles.addButtonText,
              !newTag.trim() && styles.addButtonTextDisabled
            ]}>
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.tagsContainer}>
          <View style={styles.tagsList}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveTag(tag)}
                >
                  <X size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
        
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
          >
            <Text style={styles.submitButtonText}>Save</Text>
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
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#9B87F5',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  addButtonTextDisabled: {
    opacity: 0.5,
  },
  tagsContainer: {
    maxHeight: 200,
    marginBottom: 24,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  tagText: {
    color: '#000000',
    fontSize: 14,
  },
  removeButton: {
    padding: 4,
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
}); 