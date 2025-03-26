import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function ProfileScreen() {
  return (
    <LinearGradient
      colors={['#E5E1FF', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D2B3F',
  },
}); 