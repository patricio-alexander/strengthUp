import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import OpenBook from "@/components/icons/OpenBook";
import UserCircle from "@/components/icons/UserCircle";
import { useColors } from "@/hooks/useColors";

export default function PersonalizedTabLayout() {
  const { tint, tabIconDefault, secondary } = useColors();

  return (
    <Tabs
      screenOptions={{
        animation: "shift",

        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: tabIconDefault,
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
          backgroundColor: secondary,
        },
      }}
    >
      <Tabs.Screen
        name="routine"
        options={{
          title: "routines",
          tabBarIcon: ({ color }) => <OpenBook color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          tabBarIcon: ({ color }) => <UserCircle color={color} />,
        }}
      />
    </Tabs>
  );
}
