import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();

  return <View style={[styles.container, { backgroundColor: 'black' }]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
