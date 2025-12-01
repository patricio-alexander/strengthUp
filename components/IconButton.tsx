import React, { forwardRef } from "react";
import {
  Pressable,
  type PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

type IconButtonProps = PressableProps & {
  name: keyof typeof Octicons.glyphMap;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  type?: "default" | "contained";
};

export const IconButton = forwardRef<View, IconButtonProps>(
  (
    { name, size, type = "default", color, style, disabled = false, ...rest },
    ref,
  ) => {
    const { icon, primary } = useColors();
    const padding = 10;
    const totalSize = (size ?? 26) + padding * 2.5;
    const borderRadius = totalSize / 2;

    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          [
            {
              opacity: pressed ? 0.5 : 1,
              alignItems: "center",
              justifyContent: "center",
            },
            type == "default" && {
              paddingVertical: 8,
            },
            type === "contained" && {
              borderRadius,
              width: totalSize,
              backgroundColor: primary,
              height: totalSize,
            },

            disabled && {
              opacity: 0.6,
            },
            style,
          ],
        ]}
        {...rest}
        disabled={disabled}
      >
        <Octicons name={name} size={size ?? 26} color={color ? color : icon} />
      </Pressable>
    );
  },
);
