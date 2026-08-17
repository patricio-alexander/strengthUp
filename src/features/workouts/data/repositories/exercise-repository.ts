import { ExerciseRepository } from "@features/workouts/domain/repositories/exercises-repository";
import {
  CreateExercise,
  SelectedExercise,
  UserExercise,
} from "@features/workouts/domain/entities/exercise";
import { supabase } from "@/lib/supabase";

type SelectedExerciseRow = {
  wse_id: number;
  user_exercises:
    | { exercise_id: number; name: string }
    | { exercise_id: number; name: string }[]
    | null;
};

export class ExerciseRepositoryImpl implements ExerciseRepository {
  async getDefaultExercises(): Promise<UserExercise[]> {
    const { data, error } = await supabase
      .from("user_exercises")
      .select("*")
      .eq("default_exercise", true);

    if (error) {
      throw new Error(error.message);
    }

    return data.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      user_id: exercise.user_id ?? "",
      default: Boolean(exercise.default_exercise),
    }));
  }

  async getExercises(userId: string): Promise<UserExercise[]> {
    const { data, error } = await supabase
      .from("user_exercises")
      .select("*")
      .eq("user_id", userId)
      .or("default_exercise.eq.false,default_exercise.is.null");

    if (error) {
      throw new Error(error.message);
    }

    return data.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      user_id: exercise.user_id,
      default: exercise.default_exercise,
    }));
  }

  async addExercise(name: string, userId: string): Promise<void> {
    const { error } = await supabase.from("user_exercises").insert({
      name,
      user_id: userId,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async removeExercise(id: number): Promise<void> {
    const { error } = await supabase
      .from("user_exercises")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async updateExercise(update: CreateExercise, id: number): Promise<void> {
    const { error } = await supabase
      .from("user_exercises")
      .update(update)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getSelectedExercises(workoutId: number): Promise<SelectedExercise[]> {
    const { data, error } = await supabase
      .from("workout_sessions_exercises")
      .select(
        `
          wse_id:id,
          sorted,
          user_exercises(exercise_id:id, name)
      `,
      )
      .eq("workout_id", workoutId)
      .order("sorted", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return ((data as SelectedExerciseRow[] | null) ?? []).flatMap((row) => {
      const userExercise = Array.isArray(row.user_exercises)
        ? row.user_exercises[0]
        : row.user_exercises;

      if (!userExercise) {
        return [];
      }

      return [
        {
          id: userExercise.exercise_id,
          name: userExercise.name,
          workoutSessionExerciseId: row.wse_id,
        },
      ];
    });
  }

  async addExerciseToWorkout(
    exerciseId: number,
    workoutId: number,
  ): Promise<void> {
    const { count, error: countError } = await supabase
      .from("workout_sessions_exercises")
      .select("*", { count: "exact", head: true })
      .eq("exercise_id", exerciseId)
      .eq("workout_id", workoutId);

    if (countError) {
      throw new Error(countError.message);
    }

    if (count) {
      return;
    }

    const { error } = await supabase
      .from("workout_sessions_exercises")
      .insert({ workout_id: workoutId, exercise_id: exerciseId });

    if (error) {
      throw new Error(error.message);
    }
  }

  async removeExerciseFromWorkout(
    exerciseId: number,
    workoutId: number,
  ): Promise<void> {
    const { error } = await supabase
      .from("workout_sessions_exercises")
      .delete()
      .eq("exercise_id", exerciseId)
      .eq("workout_id", workoutId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async orderSelectedExercises(exercises: SelectedExercise[]): Promise<void> {
    const results = await Promise.all(
      exercises.map((item, index) =>
        supabase
          .from("workout_sessions_exercises")
          .update({ sorted: index })
          .eq("id", item.workoutSessionExerciseId),
      ),
    );

    const failed = results.find((result) => result.error);
    if (failed?.error) {
      throw new Error(failed.error.message);
    }
  }
}
