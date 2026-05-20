import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <ThemedView style={styles.container} type="backgroundElement">
      <View style={styles.searchIcon}> 
        <ThemedText type="code">🔍</ThemedText>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search products, brands, categories"
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.two,
  },
  searchIcon: {
    width: 24,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 40,
  },
});
