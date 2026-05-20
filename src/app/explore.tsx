import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useMemo, useState } from 'react';

import { SearchEngine, SearchFilters } from '@/lib/search';
import { products } from '@/data/products';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { Filters } from '@/components/filters';
import { ProductCard } from '@/components/product-card';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const defaultFilters: SearchFilters = {
  categories: [],
  minimumRating: 0,
  priceRange: 'all',
};

export default function SearchScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    top: safeAreaInsets.top,
    bottom: safeAreaInsets.bottom + BottomTabInset,
    left: safeAreaInsets.left,
    right: safeAreaInsets.right,
  };

  const searchEngine = useMemo(() => new SearchEngine(products), []);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const categories = useMemo(() => searchEngine.getAvailableCategories(), [searchEngine]);

  const results = useMemo(
    () => searchEngine.search(query, filters),
    [searchEngine, query, filters],
  );

  function toggleCategory(category: string) {
    setFilters((current) => {
      const categories = current.categories.includes(category)
        ? current.categories.filter((existing) => existing !== category)
        : [...current.categories, category];
      return { ...current, categories };
    });
  }

  function selectRating(rating: number) {
    setFilters((current) => ({ ...current, minimumRating: rating }));
  }

  function selectPriceRange(priceRange: SearchFilters['priceRange']) {
    setFilters((current) => ({ ...current, priceRange }));
  }

  function clearFilters() {
    setFilters(defaultFilters);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
      showsVerticalScrollIndicator={false}>
      <ThemedText type="subtitle" style={styles.heading}>
        Search products
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.helpText}>
        Type a product name or category to explore instant autocomplete with typo tolerance.
      </ThemedText>
      <SearchBar value={query} onChange={setQuery} />
      <Filters
        categories={categories}
        selectedCategories={filters.categories}
        selectedRating={filters.minimumRating}
        selectedPriceRange={filters.priceRange}
        onToggleCategory={toggleCategory}
        onSelectRating={selectRating}
        onSelectPriceRange={selectPriceRange}
        onClearFilters={clearFilters}
      />
      <ThemedView style={styles.summary} type="backgroundElement">
        <ThemedText type="smallBold">{results.length} results</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {query ? `Searching for “${query}”` : 'Browse by rating, category, and price.'}
        </ThemedText>
      </ThemedView>
      <View style={styles.results}>
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>
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
    marginTop: Spacing.four,
  },
  helpText: {
    marginBottom: Spacing.one,
  },
  summary: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
  },
  results: {
    width: '100%',
  },
});
