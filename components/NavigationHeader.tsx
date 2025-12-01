import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";
import { IconButton } from "./IconButton";
import { useNavigation } from "expo-router";
import { FC } from "react";

type Props = {
  title: string | string[];
  headerRight?: () => React.ReactNode;
  headerLeft?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const NavigationHeader: FC<Props> = ({ title, headerRight, style }) => {
  const navigation = useNavigation();
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 10,
        },
        style,
      ]}
    >
      <View style={Styles.side}>
        <IconButton name="arrow-left" onPress={() => navigation.goBack()} />

        <ThemedText
          type="subtitle"
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{ flexShrink: 1 }}
        >
          {title}
        </ThemedText>
      </View>
      <View>{headerRight && headerRight()}</View>
    </View>
  );
};

const Styles = StyleSheet.create({
  side: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
});
