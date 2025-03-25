import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Modal } from '../ui/modal';
import { useToast } from '../../hooks/use-toast';

interface LinkInputDialogProps {
  visible: boolean;
  onClose: () => void;
  onProcessLink: (link: string) => Promise<void>;
}

export function LinkInputDialog({
  visible,
  onClose,
  onProcessLink,
}: LinkInputDialogProps) {
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProcessLink = async () => {
    if (!link.trim()) {
      toast({
        description: 'Please enter a link',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await onProcessLink(link.trim());
      setLink('');
      onClose();
    } catch (error) {
      toast({
        description: 'Failed to process link. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Enter Link</Text>
        
        <View style={styles.content}>
          <Text style={styles.label}>Paste a link to extract locations</Text>
          <TextInput
            style={styles.input}
            value={link}
            onChangeText={setLink}
            placeholder="https://..."
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            editable={!isLoading}
          />
          
          <TouchableOpacity
            style={[styles.button, styles.processButton]}
            onPress={handleProcessLink}
            disabled={isLoading || !link.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[
                styles.buttonText,
                (!link.trim() || isLoading) && styles.buttonTextDisabled
              ]}>
                Process Link
              </Text>
            )}
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
  content: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  processButton: {
    backgroundColor: '#9B87F5',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
}); 