import { Pressable, PressableProps, Text, useColorScheme } from "react-native";
import { GoogleLogo } from "./icons/GoogleLogo";

export const GoogleButton = ({ onPress }: PressableProps) => {
  const theme = useColorScheme() ?? "light";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme === "dark" ? "#131314" : "#F2F2F2",
        borderRadius: 100,
        borderColor: theme === "dark" ? "#8E918F" : "#747775",
        borderWidth: 1,
        opacity: pressed ? 0.8 : 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 12,
      })}
    >
      <GoogleLogo />

      <Text
        style={{
          color: theme === "dark" ? "#E3E3E3" : "#1F1F1F",
          fontFamily: "Roboto_Medium",
          fontSize: 16,
          lineHeight: 20,
        }}
      >
        Continuar con Google
      </Text>
    </Pressable>
  );
};
