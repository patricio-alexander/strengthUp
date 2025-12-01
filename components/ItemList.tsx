import {
  Pressable,
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
      <Pressable
        ref={ref}
        {...props}
        style={({ pressed }) => [
          Styles.pressable,

          { opacity: pressed ? 0.5 : 1, backgroundColor: tint },
          style,
        ]}
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
      </Pressable>
    );
  },
);

const Styles = StyleSheet.create({
  pressable: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});
