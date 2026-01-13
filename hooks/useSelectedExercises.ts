import { supabase } from "@/lib/supabase";
import { SelectedExercises } from "@/types/selectedExercises";
import { useEffect, useState } from "react";

export const useSelectedExercises = (workoutId: string) => {
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercises[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchSelectedExercises = async () => {
    setIsLoading(true);
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

    const selected = data?.map((e) => ({
      id: e.user_exercises.exercise_id,
      name: e.user_exercises.name,
      workoutSesssionExerciseId: e.wse_id,
    }));

    setSelectedExercises(selected ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSelectedExercises();
  }, []);

  return { selectedExercises, fetchSelectedExercises, isLoading };
};
