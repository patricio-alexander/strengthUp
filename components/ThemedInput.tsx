import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { type TextInputProps, TextInput, useColorScheme } from "react-native";

type ThemedInputProps = TextInputProps & {
  type?: "shadow" | "default";
};

export const ThemedInput: React.FC<ThemedInputProps> = ({
  style,
  type = "default",
  ...rest
}) => {
  const colorScheme = useColorScheme() ?? "light";

  const { text, tertiary, primary } = Colors[colorScheme];

  return (
    <TextInput
      style={[
        type === "default" && {
          color: text,
          paddingHorizontal: 10,
          paddingVertical: 15,
          fontFamily: "Inter_400Regular",
          backgroundColor: primary,
          borderRadius: 10,
          fontSize: 16,
        },
        type === "shadow" && {
          color: text,
          fontFamily: "Inter_400Regular",
          backgroundColor: "transparent",
          fontSize: 16,
        },
        style,
      ]}
      placeholderTextColor={tertiary}
      {...rest}
    />
  );
};
