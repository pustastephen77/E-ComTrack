import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { Product } from '@/data/products';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <ThemedView style={styles.card} type="backgroundElement">
      <Image source={product.imageUrl} style={styles.image} contentFit="cover" />
      <View style={styles.details}>
        <ThemedText type="subtitle" style={styles.title}>
          {product.title}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.category}>
          {product.category}
        </ThemedText>
        <Text style={styles.price}>${product.price.toFixed(0)}</Text>
        <ThemedText themeColor="textSecondary" style={styles.rating}>
          ⭐ {product.rating.toFixed(1)}
        </ThemedText>
        <ThemedText type="small" style={styles.description}>
          {product.description}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    overflow: 'hidden',
    marginBottom: Spacing.four,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
  },
  details: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  category: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: Spacing.one,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  rating: {
    fontSize: 14,
  },
  description: {
    marginTop: Spacing.one,
    lineHeight: 20,
  },
});
