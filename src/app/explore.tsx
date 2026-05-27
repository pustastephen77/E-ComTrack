import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Filters } from '@/components/filters';
import { ProductCard } from '@/components/product-card';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { products } from '@/data/products';
import { useRequireAuth } from '@/lib/auth';
import { SearchEngine, SearchFilters } from '@/lib/search';

const defaultFilters: SearchFilters = {
  categories: [],
  minimumRating: 0,
  priceRange: 'all',
};

type SortOption = 'relevance' | 'priceLowToHigh' | 'priceHighToLow' | 'highestRating';

const sortOptions: { key: SortOption; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'priceLowToHigh', label: 'Price: Low to High' },
  { key: 'priceHighToLow', label: 'Price: High to Low' },
  { key: 'highestRating', label: 'Top Rated' },
];

export default function SearchScreen() {
  const { isLoading } = useRequireAuth();
  const safeAreaInsets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const insets = {
    top: safeAreaInsets.top,
    bottom: safeAreaInsets.bottom + BottomTabInset,
    left: safeAreaInsets.left,
    right: safeAreaInsets.right,
  };

  const searchEngine = useMemo(() => new SearchEngine(products), []);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const categories = useMemo(() => searchEngine.getAvailableCategories(), [searchEngine]);

  const results = useMemo(
    () => searchEngine.search(query, filters),
    [searchEngine, query, filters],
  );

  const sortedResults = useMemo(
    () => sortProducts(results, sortBy),
    [results, sortBy],
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
        <ThemedText type="smallBold">{sortedResults.length} results</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {query ? `Searching for “${query}”` : 'Browse by rating, category, and price.'}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.sortBar} type="backgroundElement">
        <ThemedText type="smallBold">Sort by</ThemedText>
        <View style={styles.sortRow}>
          {sortOptions.map((option) => {
            const active = option.key === sortBy;
            return (
              <Pressable
                key={option.key}
                onPress={() => setSortBy(option.key)}
                style={[styles.sortChip, active && styles.sortChipActive]}>
                <ThemedText type="small" style={active ? styles.sortLabelActive : styles.sortLabel}>
                  {option.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </ThemedView>
      <View style={styles.results}>
        {sortedResults.length === 0 ? (
          <ThemedView style={styles.emptyState} type="backgroundElement">
            <ThemedText type="subtitle">No products found</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Try a different search term, adjust filters, or reset the query.
            </ThemedText>
          </ThemedView>
        ) : (
          sortedResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

function sortProducts(productsList: typeof products, sortBy: SortOption) {
  return [...productsList].sort((left, right) => {
    switch (sortBy) {
      case 'priceLowToHigh':
        return left.price - right.price;
      case 'priceHighToLow':
        return right.price - left.price;
      case 'highestRating':
        return right.rating - left.rating;
      case 'relevance':
      default:
        return 0;
    }
  });
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
  sortBar: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  sortChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: '#888',
  },
  sortChipActive: {
    backgroundColor: '#3C7DFF',
    borderColor: '#3C7DFF',
  },
  sortLabel: {
    color: '#333',
  },
  sortLabelActive: {
    color: '#fff',
  },
  emptyState: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginTop: Spacing.two,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  results: {
    width: '100%',
  },
});
