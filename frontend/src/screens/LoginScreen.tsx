import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Facebook, Mail } from 'lucide-react-native';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const { login, isLoading, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // API Integration Comments:
  // This login screen should be connected to your authentication API
  // The implementation should include these API calls:
  //
  // 1. Email Login:
  // Replace the mock login with an actual API call:
  // const handleEmailLogin = async () => {
  //   try {
  //     if (!email.trim() || !email.includes('@')) {
  //       showToast('Please enter a valid email address', 'error');
  //       return;
  //     }
  //
  //     // For email-only login (passwordless):
  //     await api.sendLoginLink(email);
  //     showToast('Check your email for a login link', 'success');
  //     
  //     // For email + password:
  //     // const response = await api.login(email, password);
  //     // await AsyncStorage.setItem('auth_token', response.token);
  //     // await AsyncStorage.setItem('user', JSON.stringify(response.user));
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     showToast('Login failed. Please try again.', 'error');
  //   }
  // };
  //
  // 2. Social Login:
  // Integrate with social providers:
  // const handleProviderLogin = async (provider: string) => {
  //   try {
  //     // Use Expo AuthSession or a similar library:
  //     // For example with Google:
  //     const { type, params } = await Google.logInAsync({
  //       clientId: 'YOUR_GOOGLE_CLIENT_ID',
  //       scopes: ['profile', 'email']
  //     });
  //
  //     if (type === 'success') {
  //       // Send the token to your backend
  //       const response = await api.socialAuth(provider, params.accessToken);
  //       await AsyncStorage.setItem('auth_token', response.token);
  //       await AsyncStorage.setItem('user', JSON.stringify(response.user));
  //     } else {
  //       showToast('Social login cancelled or failed', 'error');
  //     }
  //   } catch (error) {
  //     console.error('Social login error:', error);
  //     showToast('Social login failed. Please try again.', 'error');
  //   }
  // };

  const handleEmailLogin = () => {
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    login(email, 'email');
  };

  const handleProviderLogin = (provider: string) => {
    // In a real app, you would integrate with OAuth providers
    // For now, we'll use a mock email
    const mockEmail = `user.${provider.toLowerCase()}@example.com`;
    login(mockEmail, provider);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Inspired?</Text>
            <Text style={styles.subtitle}>Let's add it to your</Text>
            <Text style={styles.subtitle}>collection.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>
              Don't have an account? Let's get started.
            </Text>

            <View style={styles.providerButtons}>
              <TouchableOpacity
                style={[styles.button, styles.facebookButton]}
                onPress={() => handleProviderLogin('Facebook')}
                disabled={isLoading}
              >
                <Facebook size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>CONTINUE WITH FACEBOOK</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.googleButton]}
                onPress={() => handleProviderLogin('Google')}
                disabled={isLoading}
              >
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.emailForm}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.button, styles.emailButton]}
                onPress={handleEmailLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Mail size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Continue with Email</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E1FF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#2D2B3F',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#2D2B3F',
  },
  form: {
    width: '100%',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2D2B3F',
    textAlign: 'center',
    marginBottom: 24,
  },
  providerButtons: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    height: 56,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#2D2B3F',
    fontSize: 14,
  },
  emailForm: {
    gap: 12,
  },
  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E1FF',
  },
  emailButton: {
    backgroundColor: '#6A62B7',
  },
}); 