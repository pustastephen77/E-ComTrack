import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { products } from '@/data/products';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { ProductCard } from '@/components/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [],
  );
  const featured = useMemo(
    () => [...products].sort((left, right) => right.rating - left.rating).slice(0, 4),
    [],
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + BottomTabInset,
        },
      ]}
      showsVerticalScrollIndicator={false}>
      <ThemedText type="title" style={styles.heading}>
        E-Comm Track
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.subheading}>
        Fast mobile shopping with instant autocomplete, smart filtering, and typo-tolerant search.
      </ThemedText>

      <ThemedView type="backgroundElement" style={styles.feature}>
        <ThemedText type="subtitle">Quick categories</ThemedText>
        <View style={styles.categoryList}>
          {categories.map((category) => (
            <View key={category} style={styles.categoryChip}>
              <ThemedText type="smallBold">{category}</ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>

      <ThemedText type="subtitle">Featured products</ThemedText>
      {featured.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.four,
  },
  heading: {
    marginBottom: Spacing.one,
  },
  subheading: {
    lineHeight: 22,
  },
  feature: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  categoryChip: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: '#888',
  },
});
