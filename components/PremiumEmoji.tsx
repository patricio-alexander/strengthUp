import { ThemedText } from "./ThemedText";
import { type TextProps } from "react-native";

type Props = TextProps & {};

export const PremiumEmoji: React.FC<Props> = ({ style, ...props }) => {
  return (
    <ThemedText
      style={[{ position: "absolute", top: -10, right: 5 }, style]}
      {...props}
    >
      🔒
    </ThemedText>
  );
};
