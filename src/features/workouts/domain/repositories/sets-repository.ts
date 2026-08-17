import { CreateSet, LastSession } from "@features/workouts/domain/entities/set";
import { FilterSets } from "@/types/filterSets";
import { GroupSetsByDate } from "@/types/groupByDay";

export interface SetsRepository {
  addNewSet(set: CreateSet, exerciseId: number): Promise<void>;
  removeSet(setId: number): Promise<void>;
  updateSet(setId: string, set: CreateSet): Promise<void>;
  getSets(exerciseId: number, filter: FilterSets): Promise<GroupSetsByDate[]>;
  getLastSession(exerciseId: number): Promise<LastSession>;
}
