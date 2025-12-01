import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { DATABASE_NAME } from "@/constants/db";
const expo = SQLite.openDatabaseSync(DATABASE_NAME, {
  enableChangeListener: true,
});

const db = drizzle(expo);
db.run("PRAGMA foreign_keys = ON");
export { db };
