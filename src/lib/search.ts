import { Product } from '@/data/products';

export type PriceRange = 'all' | 'under50' | '50to150' | '150to300' | 'over300';

export type SearchFilters = {
  categories: string[];
  minimumRating: number;
  priceRange: PriceRange;
};

export const PRICE_RANGES: Record<PriceRange, { min: number; max: number; label: string }> = {
  all: { min: 0, max: Number.MAX_SAFE_INTEGER, label: 'All prices' },
  under50: { min: 0, max: 50, label: 'Under $50' },
  '50to150': { min: 50, max: 150, label: '$50–$150' },
  '150to300': { min: 150, max: 300, label: '$150–$300' },
  over300: { min: 300, max: Number.MAX_SAFE_INTEGER, label: '$300+' },
};

const normalize = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ');

const tokenize = (text: string) => normalize(text).split(' ').filter(Boolean);

class TrieNode {
  public children = new Map<string, TrieNode>();
  public ids = new Set<string>();
  public isWord = false;
}

class SearchTrie {
  private root = new TrieNode();

  public insert(term: string, productId: string) {
    let node = this.root;
    for (const char of term) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
      node.ids.add(productId);
    }
    node.isWord = true;
  }

  public searchPrefix(prefix: string): Set<string> {
    let node = this.root;
    for (const char of normalize(prefix)) {
      if (!node.children.has(char)) {
        return new Set();
      }
      node = node.children.get(char)!;
    }
    return new Set(node.ids);
  }

  public searchFuzzy(query: string, maxDistance = 1): Set<string> {
    const normalizedQuery = normalize(query);
    const results = new Set<string>();
    const initialRow = Array.from({ length: normalizedQuery.length + 1 }, (_, index) => index);

    for (const [char, node] of this.root.children) {
      this.searchRecursive(node, char, normalizedQuery, initialRow, results, char);
    }

    return results;
  }

  private searchRecursive(
    node: TrieNode,
    word: string,
    query: string,
    previousRow: number[],
    results: Set<string>,
    path: string,
  ) {
    const columns = query.length + 1;
    const currentRow: number[] = [previousRow[0] + 1];

    for (let column = 1; column < columns; column += 1) {
      const insertCost = currentRow[column - 1] + 1;
      const deleteCost = previousRow[column] + 1;
      const replaceCost = query[column - 1] === word[word.length - 1] ? previousRow[column - 1] : previousRow[column - 1] + 1;
      currentRow[column] = Math.min(insertCost, deleteCost, replaceCost);
    }

    if (currentRow[columns - 1] <= 1 && node.isWord) {
      node.ids.forEach((id) => results.add(id));
    }

    if (Math.min(...currentRow) <= 1) {
      for (const [nextChar, nextNode] of node.children) {
        this.searchRecursive(nextNode, nextChar, query, currentRow, results, `${path}${nextChar}`);
      }
    }
  }
}

const titleMatchWeight = 50;
const categoryMatchWeight = 25;
const descriptionMatchWeight = 10;
const ratingBoost = 2;

export class SearchEngine {
  private trie = new SearchTrie();
  private categories = new Map<string, Set<string>>();
  private allProductIds = new Set<string>();
  private productsById = new Map<string, Product>();

  constructor(products: Product[]) {
    for (const product of products) {
      this.allProductIds.add(product.id);
      this.productsById.set(product.id, product);
      tokenize(product.title).forEach((term) => this.trie.insert(term, product.id));
      tokenize(product.category).forEach((term) => this.trie.insert(term, product.id));
      if (!this.categories.has(product.category)) {
        this.categories.set(product.category, new Set());
      }
      this.categories.get(product.category)!.add(product.id);
    }
  }

  public getAvailableCategories() {
    return Array.from(this.categories.keys()).sort();
  }

  public search(input: string, filters: SearchFilters) {
    const normalizedQuery = normalize(input);
    const queryTokens = tokenize(normalizedQuery);
    const candidateIds = new Set<string>();

    if (queryTokens.length === 0) {
      this.allProductIds.forEach((id) => candidateIds.add(id));
    } else {
      for (const queryToken of queryTokens) {
        this.trie.searchPrefix(queryToken).forEach((id) => candidateIds.add(id));
        this.trie.searchFuzzy(queryToken).forEach((id) => candidateIds.add(id));
      }
    }

    const filteredProducts = Array.from(candidateIds)
      .map((id) => this.productsById.get(id))
      .filter((product): product is Product => Boolean(product))
      .filter((product) => this.applyFilters(product, filters));

    return filteredProducts
      .map((product) => ({
        product,
        score: this.scoreProduct(product, queryTokens),
      }))
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }
        if (right.product.rating !== left.product.rating) {
          return right.product.rating - left.product.rating;
        }
        return left.product.price - right.product.price;
      })
      .map(({ product }) => product);
  }

  private applyFilters(product: Product, filters: SearchFilters) {
    const priceRange = PRICE_RANGES[filters.priceRange];
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
    const matchesRating = product.rating >= filters.minimumRating;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesCategory && matchesRating && matchesPrice;
  }

  private scoreProduct(product: Product, queryTokens: string[]) {
    if (queryTokens.length === 0) {
      return product.rating * ratingBoost + titleMatchWeight;
    }

    let score = 0;
    const lowerTitle = normalize(product.title);
    const lowerCategory = normalize(product.category);
    const lowerDescription = normalize(product.description);

    for (const queryToken of queryTokens) {
      if (lowerTitle.startsWith(queryToken)) {
        score += titleMatchWeight;
      } else if (lowerTitle.split(' ').some((token) => token.startsWith(queryToken))) {
        score += titleMatchWeight * 0.7;
      } else if (lowerCategory.startsWith(queryToken) || lowerCategory.includes(queryToken)) {
        score += categoryMatchWeight;
      } else if (lowerDescription.includes(queryToken)) {
        score += descriptionMatchWeight;
      }

      if (lowerTitle.includes(queryToken)) {
        score += 4;
      }
      if (lowerCategory.includes(queryToken)) {
        score += 2;
      }
      if (lowerDescription.includes(queryToken)) {
        score += 1;
      }
    }

    score += product.rating * ratingBoost;
    return score;
  }
}
