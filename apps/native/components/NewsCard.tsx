import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  imageUrl?: string;
}

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  return (
    <View style={styles.shadow}>
    <View style={styles.card}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.content}>
        <Text style={styles.category}>{item.category.toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.source}>{item.source}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '55%',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6c63ff',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 30,
    flex: 1,
  },
  summary: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 21,
    marginTop: 10,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  source: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
  },
  dot: {
    fontSize: 13,
    color: '#cccccc',
    marginHorizontal: 6,
  },
  timeAgo: {
    fontSize: 13,
    color: '#888888',
  },
});
