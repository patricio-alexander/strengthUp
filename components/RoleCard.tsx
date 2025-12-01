import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { Href, Link } from "expo-router";

import { Role } from "@/store/userStore";
import { useColors } from "@/hooks/useColors";

type RoleCardProps = {
  role: Role;
  title: string;
  description: string;
  disabled?: boolean;
};
export const RoleCard = ({
  role,
  title,
  description,
  disabled = false,
}: RoleCardProps) => {
  const { blue, purple, secondary, green } = useColors();

  const colors: Record<Role, string> = {
    [Role.Personal]: blue,
    [Role.Personalized]: purple,
    [Role.Coach]: green,
  };

  const routes: Record<Role, Href> = {
    [Role.Personal]: "/(auth)/personal",
    [Role.Personalized]: "/(auth)/login-personalized",
    [Role.Coach]: "/(auth)/login-coach",
  };

  return (
    <Link
      href={routes[role]}
      asChild
      style={[
        styles.container,
        {
          borderColor: colors[role],
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          backgroundColor: secondary,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        style={{ opacity: disabled ? 0.7 : 1 }}
      >
        <ThemedText
          type="defaultSemiBold"
          darkColor={colors[role]}
          lightColor={colors[role]}
        >
          {title}
        </ThemedText>

        <ThemedText>{description}</ThemedText>
        {disabled && <ThemedText>(Proximamente)</ThemedText>}
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 5,
  },
});
