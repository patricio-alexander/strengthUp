import { ThemeProvider } from "@react-navigation/native";

import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

import { useFonts as useCustomFonts } from "expo-font";

import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";

import { useSubscription } from "@/hooks/useSubscription";
import { useSession } from "@/hooks/useSession";

// Prevent the splash screen from auto-hiding before asset loading is complete.

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const { addDailyNotification, addNotificationAtDate, cancelAllNotification } =
  //   useAppNotifications();

  const colorScheme = useColorScheme() ?? "light";
  const { background, tint } = Colors[colorScheme];
  const [loaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const [loadedCustom, errorCustom] = useCustomFonts({
    Roboto_Medium: require("../assets/fonts/Roboto-Medium.ttf"),
  });

  useSubscription();

  const { isAppReady } = useSession();

  const Loading = () => {
    return (
      <ThemedView style={{ alignItems: "center", justifyContent: "center" }}>
        <StatusBar style="auto" />
        <ActivityIndicator size="large" color={tint} />
      </ThemedView>
    );
  };

  if (!loaded || !isAppReady || !loadedCustom) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <StatusBar style="auto" />

      <KeyboardProvider statusBarTranslucent>
        <ThemeProvider
          value={colorScheme === "dark" ? theme.dark : theme.light}
        >
          <GestureHandlerRootView
            style={{ backgroundColor: background, flex: 1 }}
          >
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </GestureHandlerRootView>
        </ThemeProvider>
      </KeyboardProvider>
    </Suspense>
  );
}
