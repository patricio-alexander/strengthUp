import { useColors } from "@/hooks/useColors";
import { ReactNode, useEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface SkeletonProps {
  isLoading: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton = ({ isLoading, children, style }: SkeletonProps) => {
  const { tertiary } = useColors();
  const opacity = useSharedValue<number>(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 2000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    borderRadius: 10,
    backgroundColor: tertiary,
  }));

  return (
    <View style={{ position: "relative" }}>
      <View style={{ opacity: isLoading ? 0 : 1 }}>{children}</View>

      {isLoading && (
        <Animated.View
          style={[StyleSheet.absoluteFillObject, animatedStyle, style]}
        />
      )}
    </View>
  );
};
