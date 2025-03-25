import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Modal } from './ui/modal';
import { useToast } from '../hooks/use-toast';

interface ShareDialogProps {
  visible: boolean;
  onClose: () => void;
  onShare: (email: string) => Promise<void>;
  title: string;
  type: 'location' | 'board';
}

export function ShareDialog({
  visible,
  onClose,
  onShare,
  title,
  type,
}: ShareDialogProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    if (!email.trim()) {
      toast({
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await onShare(email.trim());
      toast({
        description: `${type === 'location' ? 'Location' : 'Board'} shared successfully`,
      });
      onClose();
    } catch (error) {
      toast({
        description: `Failed to share ${type}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNativeShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${type} on Scurry!`,
        title: title,
      });
    } catch (error) {
      toast({
        description: 'Failed to share',
        variant: 'destructive',
      });
    }
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Share {type === 'location' ? 'Location' : 'Board'}</Text>
        
        <View style={styles.content}>
          <Text style={styles.label}>Share via email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            onPress={handleShare}
            disabled={isLoading || !email.trim()}
          >
            <Text style={[
              styles.buttonText,
              (!email.trim() || isLoading) && styles.buttonTextDisabled
            ]}>
              {isLoading ? 'Sharing...' : 'Share'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.nativeShareButton]}
          onPress={handleNativeShare}
        >
          <Text style={styles.buttonText}>Share via...</Text>
        </TouchableOpacity>
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
  shareButton: {
    backgroundColor: '#9B87F5',
  },
  nativeShareButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.2,
  },
  dividerText: {
    color: '#FFFFFF',
    marginHorizontal: 12,
    opacity: 0.5,
  },
}); 