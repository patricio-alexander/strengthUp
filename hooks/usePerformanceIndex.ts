import { useEffect, useState } from "react";
import { sets } from "@/db/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { setsGroupByDay } from "@/utils/sets";
type SetsTable = typeof sets.$inferSelect;

export const usePerformanceIndex = (sets: SetsTable[]) => {
  const [result, setResult] = useState(0);

  useEffect(() => {
    if (!sets.length) return setResult(0);

    const sorted = sets.sort((a, b) => a.date - b.date);

    const result = setsGroupByDay(sorted);
    const date = format(new Date(), "MMM dd yyyy", { locale: es });
    const lasts = result.filter((s) => s.label !== date);
    const current = result.filter((s) => s.label === date);
    if (!current.length || !lasts.length) {
      return setResult(0);
    }

    const slice = lasts.slice(lasts.length - 1);

    const lastSets = slice.flatMap((m) => ({
      label: m.label,
      sets: m.sets,
    }))[0];

    const currentSets = current.flatMap((m) => ({
      label: m.label,
      sets: m.sets,
    }))[0];

    const calculateVolCurrentWeek = currentSets.sets.reduce((acc, curr) => {
      return acc + curr.reps * curr.weight;
    }, 0);

    const calculateVolPastWeek = lastSets.sets.reduce((acc, curr) => {
      return acc + curr.reps * curr.weight;
    }, 0);

    const diff = calculateVolCurrentWeek - calculateVolPastWeek;

    const index = diff / calculateVolPastWeek;

    setResult(index);
  }, [sets]);
  return result;
};
