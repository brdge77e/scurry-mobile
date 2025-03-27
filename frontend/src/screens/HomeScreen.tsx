import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight } from 'lucide-react-native';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export const HomeScreen = () => {
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async () => {
    if (!link.trim()) {
      showToast('Please enter a valid link', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigation.navigate('LinkResults', {
        sourceLink: link,
      });
    } catch (error) {
      showToast('Failed to process link. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Inspired?</Text>
            <Text style={styles.subtitle}>Let's add it to your</Text>
            <Text style={styles.collection}>collection.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Paste TikTok Link Here"
                value={link}
                onChangeText={setLink}
                placeholderTextColor="#A4A1BB"
              />
              {!isLoading && link.trim() && (
                <ArrowRight style={styles.arrowIcon} color="#6A62B7" size={20} />
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonLoading]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.buttonText}>Scurrying...</Text>
              ) : (
                <>
                  <Text style={styles.buttonText}>Scurry</Text>
                  <ArrowRight size={14} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2D2B3F',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2D2B3F',
    marginBottom: 8,
    textAlign: 'center',
  },
  collection: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6A62B7',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingRight: 48,
    fontSize: 16,
    color: '#2D2B3F',
    borderWidth: 2,
    borderColor: '#E5E1FF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A62B7',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonLoading: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
}); 