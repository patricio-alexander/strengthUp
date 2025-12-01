import { useEffect } from "react";
import * as Notifications from "expo-notifications";

export const useAppNotifications = () => {
  const setUp = async () => {
    try {
      await Notifications.deleteNotificationChannelAsync("training");
    } catch {}

    await Notifications.setNotificationChannelAsync("training", {
      name: "Training Channel",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "notify_strength_up", // nombre base, sin extensión
    });
  };

  const sendInstantNotification = async ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "notify_strength_up",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
        channelId: "training",
      },
    });
  };

  const addDailyNotification = async ({
    title,
    body,
    hour,
    minute,
  }: {
    title: string;
    body: string;
    hour: number;
    minute: number;
  }) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "notify_strength_up",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: "training",
      },
    });
  };

  const addNotificationAtDate = async ({
    title,
    body,
    date,
  }: {
    title: string;
    body: string;
    date: Date;
  }) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "notify_strength_up",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: "training",
      },
    });
  };

  const cancelAllNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  useEffect(() => {
    setUp();
  }, []);

  return {
    addNotificationAtDate,
    cancelAllNotification,
    addDailyNotification,
    sendInstantNotification,
  };
};
