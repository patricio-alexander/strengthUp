import { Colors } from "@/constants/Colors";
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

  const { text, tertiary, secondary } = Colors[colorScheme];

  return (
    <TextInput
      style={[
        type === "default" && {
          color: text,
          paddingHorizontal: 10,
          fontFamily: "Inter_400Regular",
          backgroundColor: secondary,
          borderRadius: 10,
          fontSize: 16,
        },
        type === "shadow" && {
          color: text,
          height: 50,
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
