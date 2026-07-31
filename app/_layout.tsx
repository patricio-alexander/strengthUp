import { ThemeProvider } from "@react-navigation/native";
import Purchases from "react-native-purchases";

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
import { Suspense, useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { useUserStore } from "@/store/userStore";
import { theme } from "@/constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";

import { supabase } from "@/lib/supabase";
import { getUserByIdUseCase } from "@/src/di/container";

// Prevent the splash screen from auto-hiding before asset loading is complete.

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setUser, setIsPremium, setSession } = useUserStore();

  // const { addDailyNotification, addNotificationAtDate, cancelAllNotification } =
  //   useAppNotifications();

  const [isAppReady, setAppIsReady] = useState(false);

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

  //useDrizzleStudio(expo);

  useEffect(() => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    Purchases.configure({
      apiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY as string,
    });

    const checkSubscription = async () => {
      const customer = await Purchases.getCustomerInfo();
      const premiumOrNo =
        customer?.entitlements.active["premium"] !== undefined;

      setIsPremium({ premium: premiumOrNo });
    };

    checkSubscription();
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession({ session });

      if (session) {
        try {
          const user = await getUserByIdUseCase.get(session.user.id);
          setUser(user);
          setAppIsReady(true);
        } catch (error) {
          console.log(error);
        }
      }

      setAppIsReady(true);
      SplashScreen.hideAsync();
    };
    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      //console.log("Auth state changed:", { event: _event, session });
      setSession({ session });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
