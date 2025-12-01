import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useColors } from "@/hooks/useColors";

type Button = {
  value: string;
  label: string;
};

type SegmentedButtonsProps = {
  value: string;
  onValueChange: (value: string) => void;
  buttons: Button[];
};

export const SegmentedButtons = ({
  value: selected,
  buttons,
  onValueChange,
}: SegmentedButtonsProps) => {
  const { primary, secondary } = useColors();

  return (
    <View style={[styles.container, { backgroundColor: secondary }]}>
      {buttons.map(({ value, label }, index) => {
        const active = selected === value;

        return (
          <TouchableOpacity
            key={value}
            style={[
              styles.button,
              {
                backgroundColor: active ? primary : secondary,
                marginRight: index === buttons.length - 1 ? 0 : 8,
              },
            ]}
            onPress={() => onValueChange(value)}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <ThemedText
              style={{
                textAlign: "center",
              }}
              type="defaultSemiBold"
            >
              {label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderRadius: 10,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
