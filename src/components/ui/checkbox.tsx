import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Checkbox({ checked, onCheckedChange }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.checkbox, checked && styles.checked]}
      onPress={() => onCheckedChange(!checked)}
    >
      {checked && <Check size={16} color="#FFFFFF" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#6A62B7',
    borderColor: '#6A62B7',
  },
});
