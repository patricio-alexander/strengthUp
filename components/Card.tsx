import { StyleSheet, type TextProps, type ViewProps, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useColors } from "@/hooks/useColors";

type CardProps = ViewProps & {};
type CardTitleProps = TextProps & {};

export const Card: React.FC<CardProps> = ({ style, children }) => {
  const { secondary } = useColors();

  return (
    <View
      style={[
        Styles.card,
        {
          backgroundColor: secondary,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ ...rest }) => {
  return <ThemedText type="subtitle" style={Styles.title} {...rest} />;
};

const Styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 9, height: -11 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    marginBottom: 8,
  },
});
