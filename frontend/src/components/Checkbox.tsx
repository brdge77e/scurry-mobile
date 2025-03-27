import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
}

export function Checkbox({ checked, onPress }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.checkbox, checked && styles.checked]}
      onPress={onPress}
    >
      {checked && (
        <View style={styles.checkmark}>
          <View style={styles.checkmarkStem} />
          <View style={styles.checkmarkKick} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
  },
  checkmarkStem: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: '#FFFFFF',
    left: 5,
  },
  checkmarkKick: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    bottom: 5,
    left: 0,
  },
}); 