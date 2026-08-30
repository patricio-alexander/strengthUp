import {
  StyleSheet,
  type PressableProps,
  ViewStyle,
  StyleProp,
  TextStyle,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { forwardRef } from "react";
import { PressableScale } from "./PressableScale";

type ItemListProps = PressableProps & {
  value: string | (() => React.ReactNode) | null;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  left?: () => React.ReactNode;
  right?: () => React.ReactNode;
};

export const ItemList = forwardRef<View, ItemListProps>(
  ({ value, style, textStyle, left, right, ...props }, ref) => {
    const tint = useThemeColor({}, "secondary");

    return (
      <PressableScale
        ref={ref}
        scaleTo={0.98}
        {...props}
        style={[Styles.pressable, { backgroundColor: tint }, style]}
      >
        <View style={{ flex: 1 }}>
          {left?.()}

          {typeof value === "string" ? (
            <ThemedText style={textStyle}>{value}</ThemedText>
          ) : (
            value?.()
          )}
        </View>
        <View>{right?.()}</View>
      </PressableScale>
    );
  },
);

const Styles = StyleSheet.create({
  pressable: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});
