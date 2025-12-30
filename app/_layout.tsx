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

import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Role, useUserStore } from "@/store/userStore";
import { theme } from "@/constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import * as Notifications from "expo-notifications";

import { motivationalMessages } from "@/constants/motivationalMessages";
import { useAppNotifications } from "@/hooks/useAppNotifications";
import { supabase } from "@/lib/supabase";

// Prevent the splash screen from auto-hiding before asset loading is complete.

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true, // suena
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const { setUser, setIsPremium, setRole, setSession } = useUserStore();

  const { addDailyNotification, addNotificationAtDate, cancelAllNotification } =
    useAppNotifications();

  const [isAppReady, setAppIsReady] = useState(false);

  const [loading, setLoading] = useState(false);

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

  //useDrizzleStudio(expo);

  async function setupNotifications() {
    // // Pedir permisos una vez
    // const { status } = await Notifications.requestPermissionsAsync();
    // if (status !== "granted") return;
    //
    // const hourToTraing = await db
    //   .select()
    //   .from(settings)
    //   .where(eq(settings.key, "hour-to-training"));
    //
    // const date = new Date();
    // const today = date.getDay();
    // // Limpiar notificaciones antiguas
    // await cancelAllNotification();
    //
    // let triggeredDate = new Date();
    // if (hourToTraing.length) {
    //   triggeredDate = new Date(Number(hourToTraing[0].value));
    // } else {
    //   triggeredDate.setHours(3, 0, 0);
    // }
    //
    // if (triggeredDate <= date) {
    //   triggeredDate.setDate(triggeredDate.getDate() + 1);
    // }
    //
    // const exercise = await db.select().from(days).where(eq(days.day, today));
    //
    // // 1 Notificación de rutina (si hay ejercicio hoy)
    // if (exercise.length) {
    //   //      console.log(format(triggeredDate, "hh:mm"));
    //   const { name } = exercise[0]; // Limpiar notificaciones antiguas
    //
    //   await addNotificationAtDate({
    //     title: "¡Hora de entrenar! 💪",
    //     body: `Hoy toca ${name} ¡No olvides calentar y dar tu máximo!`,
    //     date: triggeredDate,
    //   });
    // }
    //
    // // 2 Notificación motivacional nocturna
    // const random = Math.floor(Math.random() * motivationalMessages.length);
    //
    // await addDailyNotification({
    //   title: "Buenas noches 🌙",
    //   body: motivationalMessages[random],
    //   hour: 18,
    //   minute: 0,
    // });
  }

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
    setupNotifications();
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession({ session });

      if (session) {
        const { data: user, error } = await supabase
          .from("users")
          .select()
          .eq("id", session.user.id)
          .single();
        if (!error) {
          setAppIsReady(true);
          setUser(user);
          //console.log(user);
          return;
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

  if (!loaded || !isAppReady || loading) {
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
