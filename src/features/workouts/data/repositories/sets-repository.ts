import { SetsRepository } from "@features/workouts/domain/repositories/sets-repository";
import {
  CreateSet,
  LastSession,
  Set,
} from "@features/workouts/domain/entities/set";
import { supabase } from "@/lib/supabase";
import { FilterSets } from "@/types/filterSets";
import { setsGroupByDay } from "@/utils/sets";
import { GroupSetsByDate } from "@/types/groupByDay";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export class SetsRepositoryImpl implements SetsRepository {
  async removeSet(setId: number): Promise<void> {
    const { error } = await supabase
      .from("exercise_sets")
      .delete()
      .eq("id", setId);

    if (error) {
      throw new Error("Error al eliminar la serie");
    }
  }

  async getLastSession(exerciseId: number): Promise<LastSession> {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    const { data } = await supabase
      .from("exercise_sets")
      .select()
      .eq("workout_session_exercise_id", exerciseId)
      .lt("performed_at", new Date().toISOString())
      .limit(30);

    if (!data?.length) {
      return { label: "", sets: [] };
    }

    const sorted = data.sort(
      (a, b) =>
        new Date(a.performed_at).getTime() - new Date(b.performed_at).getTime(),
    );

    const result = setsGroupByDay(sorted);

    const today = format(new Date(), "MMM dd yyyy", { locale: es });

    const filter = result.filter(
      (s) => format(new Date(s.date), "MMM dd yyyy", { locale: es }) !== today,
    );

    const slice = filter.slice(filter.length - 1);

    if (!slice.length) {
      return { label: "", sets: [] };
    }

    const lastSet = slice.flatMap((m) => ({
      label: format(new Date(m.date), "MMM dd yyyy", { locale: es }),
      sets: m.sets.filter((s) => new Date(s.performed_at) < new Date()),
    }));
    const [{ label, sets }] = lastSet;

    return { label, sets };
  }

  async addNewSet(set: CreateSet, exerciseId: number): Promise<void> {
    const { error } = await supabase.from("exercise_sets").insert({
      weight: Number(set.weight),
      reps: Number(set.reps),
      performed_at: new Date().toISOString(),
      workout_session_exercise_id: Number(exerciseId),
    });

    if (error) {
      throw new Error("Error al agregar la serie");
    }
  }
  async deleteSet(setId: string): Promise<void> {
    const { error } = await supabase
      .from("exercise_sets")
      .delete()
      .eq("id", setId);

    if (error) {
      throw new Error("Error al eliminar la serie");
    }
  }
  async updateSet(setId: string, set: CreateSet): Promise<void> {}

  async getSets(
    exerciseId: number,
    filter: FilterSets,
  ): Promise<GroupSetsByDate[]> {
    if (filter === FilterSets.today) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const { data } = await supabase
        .from("exercise_sets")
        .select()
        .eq("workout_session_exercise_id", exerciseId)
        .gte("performed_at", start.toISOString())
        .lt("performed_at", end.toISOString());

      return setsGroupByDay(data ?? []);
    }

    if (filter === FilterSets.all) {
      const { data } = await supabase
        .from("exercise_sets")
        .select()
        .eq("workout_session_exercise_id", exerciseId);

      return setsGroupByDay(data ?? []);
    }

    if (filter === FilterSets.past) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("exercise_sets")
        .select()

        .eq("workout_session_exercise_id", exerciseId)
        .lt("performed_at", start.toISOString())
        .order("id", { ascending: false });

      return setsGroupByDay(data ?? []);
    }
    return [];
  }
}
