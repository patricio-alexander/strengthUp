import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import {
  addPushTokenUseCase,
  checkPushTokenExistsUseCase,
  getBlocksUseCase,
  getUserSettingsUseCase,
} from "@/src/di/container";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const days = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7,
};

function handleRegistrarionError(error: any) {
  alert("Error al registrar las notificaciones: " + error.message);
  throw Error("Error al registrar las notificaciones: " + error.message);
}

export const useNotifications = (userId: string, workoutId: number) => {
  const setUpPushNotifications = async () => {
    if (Platform.OS === "web") return;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      handleRegistrarionError("Permiso de notificaciones denegado");
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrarionError(
        "Project ID no encontrado en la configuración de EAS",
      );
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      const existPushToken =
        await checkPushTokenExistsUseCase.checkPushTokenExists(pushTokenString);
      if (!existPushToken) {
        await addPushTokenUseCase.addPushToken(pushTokenString, userId);
      }

      return pushTokenString;
    } catch (error) {
      handleRegistrarionError(error);
    }
  };

  const setUpLocalNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const blocks = await getBlocksUseCase.getBlocksByWorkoutId(workoutId);
    const userSettings = await getUserSettingsUseCase.getUserSettings(userId!);
    const [hour, minute] = userSettings?.hour_to_train
      .split(":")
      .map((str) => parseInt(str, 10));

    const scheduledNotifications = blocks.map((block) => {
      return Notifications.scheduleNotificationAsync({
        content: {
          title: block.name,
          body: "¡Es hora de tu entrenamiento!",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: days[block.day.toLowerCase() as keyof typeof days],
          hour: hour,
          minute: minute,
        },
      });
    });

    Promise.all(scheduledNotifications);
  };

  useEffect(() => {
    if (!userId || !workoutId) return;
    setUpPushNotifications();
    setUpLocalNotifications();
  }, [userId, workoutId]);
};
