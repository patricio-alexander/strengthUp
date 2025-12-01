import { Colors } from "@/constants/Colors";
import { Octicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import UserIcon from "./icons/User";
import SettingsIcon from "./icons/Settings";
import OpenBook from "./icons/OpenBook";
import UserCircle from "./icons/UserCircle";

type NavigationIconProps = {
  route: "routines" | "activity" | "settings";
  isFocused: boolean;
};

export const NavigationIcon = ({ route, isFocused }: NavigationIconProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const { tint, icon } = Colors[colorScheme];
  if (route === "activity")
    return <Octicons name="graph" color={isFocused ? tint : icon} size={26} />;

  if (route === "routines") return <OpenBook color={isFocused ? tint : icon} />;

  if (route === "settings")
    return <SettingsIcon color={isFocused ? tint : icon} />;

  if (route === "customers")
    return <UserIcon color={isFocused ? tint : icon} />;

  if (route === "profile")
    return <UserCircle color={isFocused ? tint : icon} />;
};
