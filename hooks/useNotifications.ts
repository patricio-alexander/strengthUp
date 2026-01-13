import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { supabase } from "@/lib/supabase";
import { motivationalMessages } from "@/constants/motivationalMessages";

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
export const useNotifications = (userId: string | undefined) => {
  const scheduleMotivationalPhrases = async () => {
    const listPhrases = Object.entries(days).map(([day, dayNumber]) => {
      const phrase =
        motivationalMessages[
          Math.floor(Math.random() * motivationalMessages.length)
        ];

      return Notifications.scheduleNotificationAsync({
        content: {
          title: "Buenas noches 🌙",
          body: phrase,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: dayNumber,
          hour: 19,
          minute: 0,
        },
      });
    });

    await Promise.all(listPhrases);
  };

  const scheduleDailyReminderTrain = async () => {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select(
        `
      day, 
      name,

      routines(
        users(settings(hour_to_train))
      )
    `,
      )
      .eq("routines.users.settings.user_id", userId);

    await Notifications.cancelAllScheduledNotificationsAsync();

    const scheduleListReminders = data?.map(
      (d: { day: keyof typeof days; routines: any; name: string }) => {
        const hourTraing = d.routines.users.settings.hour_to_train
          .split(":")
          .map((t: string) => Number(t));

        return Notifications.scheduleNotificationAsync({
          content: {
            title: "Entrenamiento de hoy",
            body: d.name,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: days[d.day],
            hour: hourTraing[0],
            minute: hourTraing[1],
          },
        });
      },
    );
    await Promise.all(scheduleListReminders);
  };

  const setUp = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;
      await Notifications.deleteNotificationChannelAsync("training");
    } catch {}

    await Notifications.setNotificationChannelAsync("training", {
      name: "Training Channel",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "notify_strength_up", // nombre base, sin extensión
    });
    await cancelAllScheduledNotifications();
    await scheduleDailyReminderTrain();
    await scheduleMotivationalPhrases();
  };

  const cancelAllScheduledNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  useEffect(() => {
    setUp();
  }, []);
};
