import { sets } from "@/db/schema";

type Sets = typeof sets.$inferSelect;

export interface GroupSetsByDate {
  date: number;
  sets: Sets[];
}
