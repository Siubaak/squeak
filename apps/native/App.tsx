import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NewsItem } from './components/NewsCard';
import NewsCardStack from './components/NewsCardStack';

const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    category: 'Technology',
    title: 'OpenAI Releases GPT-5 With Unprecedented Reasoning Capabilities',
    summary:
      'The latest model demonstrates human-level performance across a wide range of scientific and mathematical benchmarks, signaling a new era in AI development.',
    source: 'The Verge',
    timeAgo: '2h ago',
    imageUrl: 'https://picsum.photos/seed/news1/800/600',
  },
  {
    id: '2',
    category: 'Science',
    title: 'NASA Confirms Water Ice Found Near Moon\'s South Pole',
    summary:
      'Lunar reconnaissance data reveals significant deposits of water ice that could support future crewed missions and a permanent lunar base.',
    source: 'NASA',
    timeAgo: '4h ago',
    imageUrl: 'https://picsum.photos/seed/news2/800/600',
  },
  {
    id: '3',
    category: 'Business',
    title: 'Apple Surpasses $4 Trillion Market Cap for the First Time',
    summary:
      'Strong iPhone and services revenue drove Apple past a historic milestone, cementing its position as the world\'s most valuable company.',
    source: 'Bloomberg',
    timeAgo: '6h ago',
    imageUrl: 'https://picsum.photos/seed/news3/800/600',
  },
];

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.logo}>Squeak</Text>
          <Text style={styles.subtitle}>Your daily news</Text>
        </View>
        <View style={styles.cardContainer}>
          <NewsCardStack items={NEWS_ITEMS} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
    </GestureHandlerRootView>
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
