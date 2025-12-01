import { useColors } from "@/hooks/useColors";
import { StyleSheet, View, Pressable, PressableProps } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { forwardRef } from "react";
import { ThemedText } from "./ThemedText";

type SettingsElementProps = PressableProps & {
  icon: keyof typeof Octicons.glyphMap;
  title: string;
};

export const SettingsElement = forwardRef<View, SettingsElementProps>(
  ({ icon, title, ...props }, ref) => {
    const { tint } = useColors();

    return (
      <Pressable
        ref={ref}
        {...props}
        style={({ pressed }) => [
          Styles.container,
          {
            opacity: pressed ? 0.6 : 1,
          },
        ]}
      >
        <View style={Styles.element}>
          <Octicons name={icon} size={20} color={tint} />
          <ThemedText type="defaultSemiBold">{title}</ThemedText>
        </View>
        {/* <Octicons */}
        {/*   style={{ paddingRight: 20 }} */}
        {/*   name="chevron-right" */}
        {/*   size={20} */}
        {/*   color={tint} */}
        {/* /> */}
      </Pressable>
    );
  },
);

const Styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  element: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    paddingVertical: 6,
  },
});
