import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../App';

type BoardScreenRouteProp = RouteProp<RootStackParamList, 'Board'>;

export default function BoardScreen() {
  const route = useRoute<BoardScreenRouteProp>();
  const { id } = route.params;

  return (
    <LinearGradient
      colors={['#E5E1FF', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Board {id}</Text>
      </View>
    </LinearGradient>
  );
} 