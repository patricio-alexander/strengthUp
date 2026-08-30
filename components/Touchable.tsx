import { useColorScheme, View, type PressableProps } from "react-native";
import { ThemedText } from "./ThemedText";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { StyleProp, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";
import { PressableScale } from "./PressableScale";

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
      <PressableScale
        ref={ref}
        delayLongPress={100}
        scaleTo={0.96}
        style={[
          disabled && {
            opacity: 0.6,
          },

          type === "default" && {
            backgroundColor: primary,
            borderRadius: 16,
            paddingHorizontal: 12,
            justifyContent: "center",
            height: 45,
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
      </PressableScale>
    );
  },
);
