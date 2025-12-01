import { ThemeProvider } from "@react-navigation/native";
import Purchases from "react-native-purchases";

import { Stack } from "expo-router";
import { firestore } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { users, exercises, days, settings } from "@/db/schema";
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
import { drizzle } from "drizzle-orm/expo-sqlite";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator } from "react-native";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
//import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { ThemedView } from "@/components/ThemedView";
import { Role, useUserStore } from "@/store/userStore";
import * as schema from "@/db/schema";
import { theme } from "@/constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { DATABASE_NAME } from "@/constants/db";
import * as Notifications from "expo-notifications";

import { getAuth } from "firebase/auth";
import { eq } from "drizzle-orm";
import { motivationalMessages } from "@/constants/motivationalMessages";
import { useAppNotifications } from "@/hooks/useAppNotifications";

const expo = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expo, { schema });
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
  const { setUser, setIsPremium, setRole } = useUserStore();
  const { addDailyNotification, addNotificationAtDate, cancelAllNotification } =
    useAppNotifications();

  const [isAppReady, setAppIsReady] = useState(false);

  const { success, error } = useMigrations(db, migrations);
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

  const loadLocalUserData = async () => {
    try {
      const exe = await db.select().from(exercises);

      const user = await db.select().from(users);

      // await db.insert(sets).values([
      //   // Febrero 2025
      //   {
      //     dayExerciseId: 113,
      //     reps: 8,
      //     weight: 25,
      //     date: new Date(2025, 1, 5).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 10,
      //     weight: 27.5,
      //     date: new Date(2025, 1, 15).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 12,
      //     weight: 30,
      //     date: new Date(2025, 1, 25).getTime(),
      //   },
      //
      //   // Marzo 2025
      //   {
      //     dayExerciseId: 113,
      //     reps: 10,
      //     weight: 30,
      //     date: new Date(2025, 2, 5).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 8,
      //     weight: 32.5,
      //     date: new Date(2025, 2, 15).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 12,
      //     weight: 35,
      //     date: new Date(2025, 2, 25).getTime(),
      //   },
      //
      //   // Abril 2025
      //   {
      //     dayExerciseId: 113,
      //     reps: 12,
      //     weight: 35,
      //     date: new Date(2025, 3, 5).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 10,
      //     weight: 37.5,
      //     date: new Date(2025, 3, 15).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 8,
      //     weight: 40,
      //     date: new Date(2025, 3, 25).getTime(),
      //   },
      //
      //   // Mayo 2025
      //   {
      //     dayExerciseId: 113,
      //     reps: 10,
      //     weight: 25,
      //     date: new Date(2025, 4, 5).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 12,
      //     weight: 27.5,
      //     date: new Date(2025, 4, 15).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 8,
      //     weight: 30,
      //     date: new Date(2025, 4, 25).getTime(),
      //   },
      //
      //   // Junio 2025
      //   {
      //     dayExerciseId: 113,
      //     reps: 8,
      //     weight: 30,
      //     date: new Date(2025, 5, 5).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 10,
      //     weight: 32.5,
      //     date: new Date(2025, 5, 15).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 12,
      //     weight: 35,
      //     date: new Date(2025, 5, 25).getTime(),
      //   },
      //
      //   // Julio 2025
      //   {
      //     dayExerciseId: 113,
      //     reps: 12,
      //     weight: 35,
      //     date: new Date(2025, 6, 5).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 10,
      //     weight: 37.5,
      //     date: new Date(2025, 6, 15).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 8,
      //     weight: 40,
      //     date: new Date(2025, 6, 25).getTime(),
      //   },
      //
      //   // Agosto 2025
      //   {
      //     dayExerciseId: 113,
      //     reps: 6,
      //     weight: 20,
      //     date: new Date(2025, 7, 5).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 8,
      //     weight: 25,
      //     date: new Date(2025, 7, 15).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 10,
      //     weight: 30,
      //     date: new Date(2025, 7, 25).getTime(),
      //   },
      //
      //   // Septiembre 2025
      //   {
      //     dayExerciseId: 113,
      //     reps: 8,
      //     weight: 25,
      //     date: new Date(2025, 8, 5).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 10,
      //     weight: 30,
      //     date: new Date(2025, 8, 15).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 12,
      //     weight: 35,
      //     date: new Date(2025, 8, 25).getTime(),
      //   },
      //
      //   // Octubre 2025
      //   {
      //     dayExerciseId: 113,
      //     reps: 8,
      //     weight: 30,
      //     date: new Date(2025, 9, 5).getTime(),
      //   },
      //   {
      //     dayExerciseId: 113,
      //     reps: 10,
      //     weight: 32.5,
      //     date: new Date(2025, 9, 15).getTime(),
      //   },
      // ]);

      if (!exe.length) {
        //await db.insert(exercises).values(defaultExercises);
      }

      if (!user.length) {
        setUser({ user: "", userId: 0 });

        return;
      }

      if (user[0].loggedIn) {
        setUser({ user: user[0].username, userId: user[0].id });
        setRole({ role: Role.Personal });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadRemoteUserData = async (user: any) => {
    setLoading(true);
    const docRef = doc(firestore, "coachs", user?.uid);
    const coachSnap = await getDoc(docRef);

    if (!coachSnap.exists()) {
      const docRef = doc(firestore, "customers", user?.uid);
      const personalized = await getDoc(docRef);
      setRole({ role: personalized.data()?.role });
      setLoading(false);
      return;
    }

    setRole({ role: coachSnap.data()?.role });
    setLoading(false);
  };

  async function setupNotifications() {
    // Pedir permisos una vez
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    const hourToTraing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "hour-to-training"));

    const date = new Date();
    const today = date.getDay();
    // Limpiar notificaciones antiguas
    await cancelAllNotification();

    let triggeredDate = new Date();
    if (hourToTraing.length) {
      triggeredDate = new Date(Number(hourToTraing[0].value));
    } else {
      triggeredDate.setHours(3, 0, 0);
    }

    if (triggeredDate <= date) {
      triggeredDate.setDate(triggeredDate.getDate() + 1);
    }

    const exercise = await db.select().from(days).where(eq(days.day, today));

    // 1 Notificación de rutina (si hay ejercicio hoy)
    if (exercise.length) {
      //      console.log(format(triggeredDate, "hh:mm"));
      const { name } = exercise[0]; // Limpiar notificaciones antiguas

      await addNotificationAtDate({
        title: "¡Hora de entrenar! 💪",
        body: `Hoy toca ${name} ¡No olvides calentar y dar tu máximo!`,
        date: triggeredDate,
      });
    }

    // 2 Notificación motivacional nocturna
    const random = Math.floor(Math.random() * motivationalMessages.length);

    await addDailyNotification({
      title: "Buenas noches 🌙",
      body: motivationalMessages[random],
      hour: 18,
      minute: 0,
    });
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
    const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
      if (!success) return;

      if (user) {
        await loadRemoteUserData(user);
        setAppIsReady(true);
        SplashScreen.hideAsync();
      } else {
        setRole({ role: null });
        setAppIsReady(true);

        await loadLocalUserData();
        SplashScreen.hideAsync();
      }
    });

    return unsubscribe;
  }, [success]);

  const Loading = () => {
    return (
      <ThemedView style={{ alignItems: "center", justifyContent: "center" }}>
        <StatusBar style="auto" />
        <ActivityIndicator size="large" color={tint} />
      </ThemedView>
    );
  };

  if (!loaded || !success || !isAppReady || loading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <StatusBar style="auto" />

      <KeyboardProvider statusBarTranslucent>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense
        >
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
        </SQLiteProvider>
      </KeyboardProvider>
    </Suspense>
  );
}
