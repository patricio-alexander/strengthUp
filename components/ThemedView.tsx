import { View, StyleSheet, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import Constants from "expo-constants";
import { useColors } from "@/hooks/useColors";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { background } = useColors();

  return (
    <View
      style={[{ backgroundColor: background }, style, Styles.container]}
      {...otherProps}
    />
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 4,
  },
});
