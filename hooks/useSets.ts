import { TrainingFacade } from "@/facades/TrainingFacade";
import { FilterSets } from "@/types/filterSets";
import { useEffect, useState } from "react";
import { GroupSetsByDate } from "@/types/groupByDay";

export const useSets = (dayExerciseId: number, filter: FilterSets) => {
  const [sets, setSets] = useState<GroupSetsByDate[]>([]);

  const getSets = async () => {
    const data = await TrainingFacade.getSets(dayExerciseId, filter);
    setSets(data);
  };

  useEffect(() => {
    getSets();
  }, []);

  return { sets, getSets };
};
