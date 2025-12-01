import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

export const HeaderTable: React.FC = () => {
  return (
    <View style={Styles.row}>
      <ThemedText type="defaultSemiBold" style={Styles.header}>
        Serie
      </ThemedText>
      <ThemedText type="defaultSemiBold" style={Styles.header}>
        Peso (kg)
      </ThemedText>
      <ThemedText type="defaultSemiBold" style={Styles.header}>
        Reps
      </ThemedText>
    </View>
  );
};

const Styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  header: {
    textAlign: "center",
  },
});
