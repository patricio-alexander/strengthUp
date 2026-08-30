import { useColors } from "@/hooks/useColors";
import { StyleSheet, View, PressableProps } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { forwardRef } from "react";
import { ThemedText } from "./ThemedText";
import { PressableScale } from "./PressableScale";

type SettingsElementProps = PressableProps & {
  icon: keyof typeof Octicons.glyphMap;
  title: string;
};

export const SettingsElement = forwardRef<View, SettingsElementProps>(
  ({ icon, title, ...props }, ref) => {
    const { tint } = useColors();

    return (
      <PressableScale
        ref={ref}
        scaleTo={0.97}
        {...props}
        style={Styles.container}
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
      </PressableScale>
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
