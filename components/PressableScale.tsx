import React, { forwardRef } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type View,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING = { damping: 16, stiffness: 420, mass: 0.35 };

type PressableScaleProps = PressableProps & {
  scaleTo?: number;
  style?: StyleProp<ViewStyle> | PressableProps["style"];
};

export const PressableScale = forwardRef<View, PressableScaleProps>(
  function PressableScale(
    { scaleTo = 0.96, disabled, onPressIn, onPressOut, style, ...rest },
    ref,
  ) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <AnimatedPressable
        ref={ref}
        {...rest}
        disabled={disabled}
        onPressIn={(event) => {
          if (!disabled) {
            scale.value = withSpring(scaleTo, SPRING);
          }
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1, SPRING);
          onPressOut?.(event);
        }}
        style={
          typeof style === "function"
            ? (state) => [animatedStyle, style(state)]
            : [animatedStyle, style]
        }
      />
    );
  },
);
