import { Redirect, Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Octicons } from "@expo/vector-icons";
import SettingsIcon from "@/components/icons/Settings";
import { useUserStore } from "@/store/userStore";

import { useNotifications } from "@/hooks/useNotifications";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session, user } = useUserStore();

  useNotifications(user?.id);

  if (!session) {
    return <Redirect href={{ pathname: "/" }} />;
  }

  return (
    <Tabs
      screenOptions={{
        animation: "shift",

        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarItemStyle: {
          alignItems: "center",
          flexDirection: "row",
        },
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      }}
    >
      <Tabs.Screen
        name="(routines)"
        options={{
          title: "INICIO",
          tabBarIcon: ({ color }) => (
            <Octicons name="home" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(settings)"
        options={{
          title: "AJUSTES",
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
