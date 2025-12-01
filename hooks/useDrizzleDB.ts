import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

export const useDrizzleDB = () => {
  const db = useSQLiteContext();
  return drizzle(db);
};
