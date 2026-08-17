import { Set } from "@features/workouts/domain/entities/set";

export interface GroupSetsByDate {
  date: string;
  sets: Set[];
}
