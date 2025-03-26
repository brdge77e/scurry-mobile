import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function NotFoundScreen() {
  useEffect(() => {
    // Redirect to the main app
    setTimeout(() => {
      // Use window.location to force a full app reload to the main entry
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      } else {
        router.replace('/');
      }
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redirecting...</Text>
      <Text style={styles.subtitle}>Taking you to the main app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
  },
});
