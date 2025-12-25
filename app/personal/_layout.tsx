import { Redirect, Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Octicons } from "@expo/vector-icons";
import SettingsIcon from "@/components/icons/Settings";
import { useUserStore } from "@/store/userStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session } = useUserStore();
  if (!session) {
    return <Redirect href={{ pathname: "/" }} />;
  }

  return (
    <Tabs
      screenOptions={{
        animation: "shift",

        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarItemStyle: {
          alignItems: "center",
          flexDirection: "row",
        },
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].secondary,
        },
      }}
    >
      <Tabs.Screen
        name="(routines)"
        options={{
          title: "routines",
          tabBarIcon: ({ color }) => (
            <Octicons name="graph" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(settings)"
        options={{
          title: "settings",
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
