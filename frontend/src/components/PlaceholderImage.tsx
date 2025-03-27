import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'lucide-react-native';

interface PlaceholderImageProps {
  size?: number;
  color?: string;
}

export function PlaceholderImage({ size = 24, color = '#6B7280' }: PlaceholderImageProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image size={size * 0.6} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 