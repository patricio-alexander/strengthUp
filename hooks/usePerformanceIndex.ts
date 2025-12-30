import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GroupSetsByDate } from "@/types/groupByDay";

export const usePerformanceIndex = (sets: GroupSetsByDate[]) => {
  const [result, setResult] = useState(0);

  useEffect(() => {
    if (!sets.length) return setResult(0);

    const sorted = sets.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const today = format(new Date(), "MMM dd yyyy", { locale: es });
    const lasts = sorted.filter(
      (s) => format(new Date(s.date), "MMM dd yyyy", { locale: es }) !== today,
    );

    const current = sorted.filter(
      (s) => format(new Date(s.date), "MMM dd yyyy", { locale: es }) === today,
    );

    if (!current.length || !lasts.length) {
      return setResult(0);
    }

    const calculateVolCurrentWeek = current[0].sets.reduce((acc, curr) => {
      return acc + curr.reps * curr.weight;
    }, 0);

    const calculateVolPastWeek = lasts[0].sets.reduce((acc, curr) => {
      return acc + curr.reps * curr.weight;
    }, 0);

    const diff = calculateVolCurrentWeek - calculateVolPastWeek;

    const index = diff / calculateVolPastWeek;

    setResult(index);
  }, [sets]);
  return result;
};
