import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import Checkbox from "expo-checkbox";
import { useColors } from "@/hooks/useColors";

type ThemedCheckBoxProps = {
  check?: boolean;
  title: string;
  handleChange: (v: boolean) => void;
};

export const ThemedCheckBox = ({
  title,
  check,
  handleChange,
}: ThemedCheckBoxProps) => {
  const { tertiary } = useColors();
  const toggleCheck = () => handleChange(!check);

  return (
    <Pressable style={styles.container} onPress={toggleCheck}>
      <Checkbox value={check} onValueChange={handleChange} color={tertiary} />

      <ThemedText>{title}</ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
