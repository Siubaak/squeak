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

function FrontCard({ item, dragX }: { item: NewsItem; dragX: SharedValue<number> }) {
  const animStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      dragX.value,
      [-SCREEN_WIDTH, SCREEN_WIDTH],
      [-12, 12],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateX: dragX.value }, { rotate: `${rotate}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.card, { zIndex: MAX_VISIBLE + 1 }, animStyle]}>
      <NewsCard item={item} />
    </Animated.View>
  );
}

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
    const progress = Math.min(Math.abs(dragX.value) / SWIPE_THRESHOLD, 1);
    const translateY = interpolate(
      progress,
      [0, 1],
      [index * PEEK_HEIGHT, (index - 1) * PEEK_HEIGHT],
    );
    const scaleX = interpolate(progress, [0, 1], [1 - index * 0.04, 1 - (index - 1) * 0.04]);
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

  const onSwipeComplete = useCallback(() => {
    setItems(prev => [...prev.slice(1), prev[0]]);
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
        const dir = e.translationX > 0 ? 1 : -1;
        dragX.value = withTiming(dir * SCREEN_WIDTH * 1.5, { duration: 250 }, () =>
          runOnJS(onSwipeComplete)(),
        );
      } else {
        dragX.value = withSpring(0, { damping: 20 });
      }
    });

  const visible = items.slice(0, MAX_VISIBLE);

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.root}>
        {[...visible].reverse().map((item, ri) => {
          const index = visible.length - 1 - ri;
          if (index === 0) {
            return <FrontCard key={item.id} item={item} dragX={dragX} />;
          }
          return (
            <BackCard
              key={item.id}
              item={item}
              index={index}
              dragX={dragX}
              zIndex={MAX_VISIBLE - index}
            />
          );
        })}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
