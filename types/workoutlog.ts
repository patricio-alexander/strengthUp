import { ExercisesBlock } from "./routine";
import { Timestamp } from "firebase/firestore";

export type WorkoutLog = {
  customerId: string;
  blockName: string;
  exercises: ExercisesBlock[];
  plannedDate?: Timestamp;
};
