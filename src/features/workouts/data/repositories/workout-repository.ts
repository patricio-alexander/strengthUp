import { WorkoutRepository } from "@features/workouts/domain/repositories/workout-repository";
import { Workout } from "@features/workouts/domain/entities/workout";
import { supabase } from "@/lib/supabase";

export class WorkoutRepositoryImpl implements WorkoutRepository {
  async getUserWorkout(userId: string): Promise<Workout | null> {
    const { data, error } = await supabase
      .from("routines")
      .select(
        `
              id,
              user_id,
              name,
              workout_sessions(count)
            `,
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error al obtener la rutina: ${error.message}`);
    }
    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      totalSessions: data.workout_sessions[0].count,
    };
  }

  async addWorkout(name: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("routines")
      .insert({ name, user_id: userId });
    if (error) {
      throw new Error("Error al agregar rutina");
    }
  }

  async removeWorkout(id: string): Promise<void> {
    const { error } = await supabase.from("routines").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
  }
  updateWorkout(workout: Workout): Promise<void> {
    throw new Error("Método no implementado");
  }
}
