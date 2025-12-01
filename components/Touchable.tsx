import {
  Pressable,
  useColorScheme,
  View,
  type PressableProps,
} from "react-native";
import { ThemedText } from "./ThemedText";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { StyleProp, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";

type ButtonProps = PressableProps & {
  title?: string;
  type?: "default" | "shadow" | "danger";
  icon?: keyof typeof Octicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export const Touchable = React.forwardRef<View, ButtonProps>(
  (
    { title, type = "default", icon, style, disabled = false, ...rest },
    ref,
  ) => {
    const colorScheme = useColorScheme() ?? "light";

    const { primary, text, danger } = Colors[colorScheme];

    return (
      <Pressable
        ref={ref}
        delayLongPress={100}
        style={({ pressed }) => [
          {
            opacity: !pressed ? 1 : 0.6,
          },
          disabled && {
            opacity: 0.6,
          },

          type === "default" && {
            backgroundColor: primary,
            borderRadius: 10,
            paddingHorizontal: 12,
            marginBottom: 6,
            justifyContent: "center",
            height: 45,
            marginHorizontal: 12,
            paddingVertical: 6,
          },
          type === "danger" && {
            justifyContent: "center",
          },

          style,
        ]}
        {...rest}
        disabled={disabled}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon && (
            <Octicons
              name={icon}
              style={{ marginRight: 8 }}
              color={text}
              size={20}
            />
          )}
          <ThemedText
            style={[
              {
                textAlign: "center",
                fontFamily: "Inter_500Medium",
              },
              type === "default"
                ? {
                    color: text,
                  }
                : undefined,

              type === "danger"
                ? {
                    color: danger,
                  }
                : undefined,
            ]}
          >
            {title}
          </ThemedText>
        </View>
      </Pressable>
    );
  },
);
