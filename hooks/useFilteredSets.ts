import { TrainingFacade } from "@/facades/TrainingFacade";
import { useEffect, useState } from "react";

export const useFilteredSets = (
  dayExerciseId: number,
  filter: "today" | "all" | "past",
) => {
  const [listSets, setSets] = useState([]);

  const getSets = async () => {
    const data = await TrainingFacade.getSets(dayExerciseId, filter);
    setSets(data);
  };

  useEffect(() => {
    getSets();
  }, []);

  return { listSets };
};
