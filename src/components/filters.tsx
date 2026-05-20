import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { PriceRange } from '@/lib/search';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type FilterPanelProps = {
  categories: string[];
  selectedCategories: string[];
  selectedRating: number;
  selectedPriceRange: PriceRange;
  onToggleCategory: (category: string) => void;
  onSelectRating: (rating: number) => void;
  onSelectPriceRange: (range: PriceRange) => void;
  onClearFilters: () => void;
};

const ratingOptions = [0, 3, 4, 4.5];
const priceOptions: PriceRange[] = ['all', 'under50', '50to150', '150to300', 'over300'];

export function Filters({
  categories,
  selectedCategories,
  selectedRating,
  selectedPriceRange,
  onToggleCategory,
  onSelectRating,
  onSelectPriceRange,
  onClearFilters,
}: FilterPanelProps) {
  return (
    <ThemedView style={styles.panel} type="backgroundElement">
      <View style={styles.header}> 
        <ThemedText type="subtitle">Filters</ThemedText>
        <Pressable style={styles.clearButton} onPress={onClearFilters}>
          <Text style={styles.clearText}>Reset</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        {categories.map((category) => {
          const active = selectedCategories.includes(category);
          return (
            <Pressable
              key={category}
              onPress={() => onToggleCategory(category)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{category}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.rowLabel}>
        <ThemedText type="smallBold">Minimum rating</ThemedText>
      </View>
      <View style={styles.row}>
        {ratingOptions.map((rating) => {
          const active = selectedRating === rating;
          return (
            <Pressable
              key={rating}
              onPress={() => onSelectRating(rating)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{rating === 0 ? 'Any' : `★ ${rating}`}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.rowLabel}>
        <ThemedText type="smallBold">Price</ThemedText>
      </View>
      <View style={styles.row}>
        {priceOptions.map((range) => {
          const active = selectedPriceRange === range;
          return (
            <Pressable
              key={range}
              onPress={() => onSelectPriceRange(range)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{range === 'all' ? 'Any' : range}</Text>
            </Pressable>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  clearButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3C7DFF',
  },
  rowLabel: {
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: '#888',
  },
  chipActive: {
    backgroundColor: '#3C7DFF',
    borderColor: '#3C7DFF',
  },
  chipLabel: {
    fontSize: 12,
    color: '#333',
  },
  chipLabelActive: {
    color: '#fff',
  },
});
