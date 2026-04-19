import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import NewsCard, { NewsItem } from './components/NewsCard';

const SAMPLE_NEWS: NewsItem = {
  id: '1',
  category: 'Technology',
  title: 'OpenAI Releases GPT-5 With Unprecedented Reasoning Capabilities',
  summary:
    'The latest model demonstrates human-level performance across a wide range of scientific and mathematical benchmarks, signaling a new era in AI development.',
  source: 'The Verge',
  timeAgo: '2h ago',
  imageUrl: 'https://picsum.photos/seed/news1/800/600',
};

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.logo}>Squeak</Text>
          <Text style={styles.subtitle}>Your daily news</Text>
        </View>
        <View style={styles.cardContainer}>
          <NewsCard item={SAMPLE_NEWS} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    marginTop: 2,
  },
});
