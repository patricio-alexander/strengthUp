import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleDB } from "./useDrizzleDB";
import { settings } from "@/db/schema";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { eq } from "drizzle-orm";

export const useHourToTrain = () => {
  const drizzleDb = useDrizzleDB();

  const { data } = useLiveQuery(
    drizzleDb
      .select()
      .from(settings)
      .where(eq(settings.key, "hour-to-training")),
  );

  const setHourToTraining = async (time: DateTimePickerEvent) => {
    await drizzleDb
      .insert(settings)
      .values({
        key: "hour-to-training",
        value: time.nativeEvent.timestamp.toString(),
      })
      .onConflictDoUpdate({
        target: settings.key, // la columna que debe ser única
        set: {
          value: time.nativeEvent.timestamp.toString(),
        },
      });
  };

  return {
    existHour: Boolean(data.length),
    setHourToTraining,
    hour: Number(data[0]?.value),
  };
};
