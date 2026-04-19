import React, { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import NewsCard, { NewsItem } from './NewsCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const PEEK_HEIGHT = 14;
const MAX_VISIBLE = 3;

// Right drag: flies off right with tilt. Left drag: stays still (previous card overlays it).
function FrontCard({ item, dragX }: { item: NewsItem; dragX: SharedValue<number> }) {
  const animStyle = useAnimatedStyle(() => {
    if (dragX.value >= 0) {
      const rotate = interpolate(dragX.value, [0, SCREEN_WIDTH], [0, 12], Extrapolation.CLAMP);
      return { transform: [{ translateX: dragX.value }, { rotate: `${rotate}deg` }] };
    }
    // Mirrors right swipe timing: only animate in the last SWIPE_THRESHOLD of the previous card's travel
    const prevX = SCREEN_WIDTH + dragX.value;
    const progress = 1 - Math.min(Math.max(prevX / SWIPE_THRESHOLD, 0), 1);
    const scaleX = interpolate(progress, [0, 1], [1, 1 - 0.04]);
    const translateY = interpolate(progress, [0, 1], [0, PEEK_HEIGHT]);
    return { transform: [{ scaleX }, { translateY }] };
  });

  return (
    <Animated.View style={[styles.card, { zIndex: MAX_VISIBLE }, animStyle]}>
      <NewsCard item={item} />
    </Animated.View>
  );
}

// Mirror of right swipe: slides in from the left with a matching tilt.
function PreviousCard({ item, dragX }: { item: NewsItem; dragX: SharedValue<number> }) {
  const animStyle = useAnimatedStyle(() => {
    if (dragX.value >= 0) {
      return { transform: [{ translateX: SCREEN_WIDTH }] };
    }
    const translateX = Math.max(0, SCREEN_WIDTH + dragX.value);
    const rotate = interpolate(translateX, [0, SCREEN_WIDTH], [0, 12], Extrapolation.CLAMP);
    return { zIndex: MAX_VISIBLE + 1, transform: [{ translateX }, { rotate: `${rotate}deg` }] };
  });

  return (
    <Animated.View style={[styles.card, animStyle]}>
      <NewsCard item={item} />
    </Animated.View>
  );
}

// Back cards only promote on right swipe.
function BackCard({
  item,
  index,
  dragX,
  zIndex,
}: {
  item: NewsItem;
  index: number;
  dragX: SharedValue<number>;
  zIndex: number;
}) {
  const animStyle = useAnimatedStyle(() => {
    let progress;
    if (dragX.value >= 0) {
      progress = Math.min(dragX.value / SWIPE_THRESHOLD, 1);
    } else {
      // Mirror right-swipe timing: only animate in the last SWIPE_THRESHOLD of the previous card's travel
      const prevX = SCREEN_WIDTH + dragX.value;
      progress = -(1 - Math.min(Math.max(prevX / SWIPE_THRESHOLD, 0), 1));
    }
    const translateY = interpolate(
      progress,
      [-1, 0, 1],
      [(index + 1) * PEEK_HEIGHT, index * PEEK_HEIGHT, (index - 1) * PEEK_HEIGHT],
    );
    const scaleX = interpolate(
      progress,
      [-1, 0, 1],
      [1 - (index + 1) * 0.04, 1 - index * 0.04, 1 - (index - 1) * 0.04],
    );
    return { transform: [{ translateY }, { scaleX }] };
  });

  return (
    <Animated.View style={[styles.card, { zIndex }, animStyle]}>
      <NewsCard item={item} />
    </Animated.View>
  );
}

interface Props {
  items: NewsItem[];
}

export default function NewsCardStack({ items: initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const dragX = useSharedValue(0);

  const onSwipeRight = useCallback(() => {
    // right swipe → next card
    setItems(prev => [...prev.slice(1), prev[0]]);
    dragX.value = 0;
  }, [dragX]);

  const onSwipeLeft = useCallback(() => {
    // left swipe → previous card
    setItems(prev => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    dragX.value = 0;
  }, [dragX]);

  const gesture = Gesture.Pan()
    .onUpdate(e => {
      dragX.value = e.translationX;
    })
    .onEnd(e => {
      const pastThreshold =
        Math.abs(e.translationX) > SWIPE_THRESHOLD || Math.abs(e.velocityX) > 800;
      if (pastThreshold) {
        if (e.translationX > 0) {
          dragX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 250 }, () =>
            runOnJS(onSwipeRight)(),
          );
        } else {
          // Animate dragX to -SCREEN_WIDTH so previous card settles at x=0
          dragX.value = withTiming(-SCREEN_WIDTH, { duration: 250 }, () =>
            runOnJS(onSwipeLeft)(),
          );
        }
      } else {
        dragX.value = withSpring(0, { damping: 20 });
      }
    });

  const visible = items.slice(0, MAX_VISIBLE);
  const previousItem = items[items.length - 1];

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.root}>
        {items.length > 1 && (
          <PreviousCard item={previousItem} dragX={dragX} />
        )}
        {[...visible].reverse().map((item, ri) => {
          const index = visible.length - 1 - ri;
          if (index === 0) return <FrontCard key={item.id} item={item} dragX={dragX} />;
          return (
            <BackCard key={item.id} item={item} index={index} dragX={dragX} zIndex={MAX_VISIBLE - index} />
          );
        })}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
