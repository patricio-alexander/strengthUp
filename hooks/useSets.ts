import { FilterSets } from "@/types/filterSets";
import { useEffect, useState } from "react";
import { GroupSetsByDate } from "@/types/groupByDay";
import { supabase } from "@/lib/supabase";
import { setsGroupByDay } from "@/utils/sets";

export const useSets = (
  workoutSesssionExerciseId: number,
  filter: FilterSets,
) => {
  const [sets, setSets] = useState<GroupSetsByDate[]>([]);

  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const getSets = async () => {
    if (filter === FilterSets.today) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const { data } = await supabase
        .from("exercise_sets")
        .select()
        .eq("workout_session_exercise_id", workoutSesssionExerciseId)
        .gte("performed_at", start.toISOString())
        .lt("performed_at", end.toISOString());

      if (!data?.length) return setIsLoading(false);

      const d = setsGroupByDay(data);

      setSets(d);
    }

    if (filter === FilterSets.all) {
      const { data } = await supabase
        .from("exercise_sets")
        .select()
        .eq("workout_session_exercise_id", workoutSesssionExerciseId);

      if (!data?.length) return setIsLoading(false);

      const d = setsGroupByDay(data);

      setSets(d ?? []);
    }

    if (filter === FilterSets.past) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("exercise_sets")
        .select()

        .eq("workout_session_exercise_id", workoutSesssionExerciseId)
        .lt("performed_at", start.toISOString())
        .order("id", { ascending: false });
      if (!data?.length) return setIsLoading(false);
      const d = setsGroupByDay(data);

      setSets(d ?? []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getSets();
  }, []);

  return { sets, getSets, isLoading };
};
