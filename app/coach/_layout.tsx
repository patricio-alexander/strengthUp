import { Tabs } from "expo-router";
import { useColors } from "@/hooks/useColors";
import UserIcon from "@/components/icons/User";
import SettingsIcon from "@/components/icons/Settings";

export default function TabLayout() {
  const { secondary, tint, tabIconDefault } = useColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "shift",
        tabBarStyle: {
          backgroundColor: secondary,
        },
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: tabIconDefault,
        tabBarShowLabel: false,

        tabBarHideOnKeyboard: true,
        tabBarItemStyle: {
          alignItems: "center",
          flexDirection: "row",
        },
      }}
    >
      <Tabs.Screen
        name="(rooms)"
        options={{
          title: "customers",
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="coach-settings"
        options={{
          title: "settings",
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
