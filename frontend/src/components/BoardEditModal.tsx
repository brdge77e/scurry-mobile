import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { X, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface BoardEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { name: string; coverImage?: string }) => void;
  initialData?: {
    name: string;
    coverImage?: string;
  };
  mode: 'create' | 'edit';
}

export function BoardEditModal({
  visible,
  onClose,
  onSave,
  initialData,
  mode,
}: BoardEditModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage);

  // Update state when initialData changes or modal becomes visible
  useEffect(() => {
    if (visible) {
      setName(initialData?.name || '');
      setCoverImage(initialData?.coverImage);
    }
  }, [initialData, visible]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setCoverImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
  
    onSave({ name: name.trim(), coverImage });
  
    // 👇 Only reset state if in "create" mode
    if (mode === 'create') {
      setName('');
      setCoverImage(undefined);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color="#2D2B3F" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.coverImageContainer}
            onPress={handlePickImage}
          >
            {coverImage ? (
              <Image 
                source={{ uri: coverImage }} 
                style={styles.coverImage}
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <ImageIcon size={32} color="#6B7280" />
                <Text style={styles.placeholderText}>
                  Tap here to add a cover image
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Board name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter board name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#6B7280"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!name.trim()}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: '#6A62B7',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
  },
  coverImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E1FF',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2D2B3F',
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6A62B7',
  },
}); 