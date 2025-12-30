import { Filter } from "@/types/filters";
import { sets } from "@/db/schema";
import { useEffect, useState } from "react";
import { setsGroupByMonth, setsGroupByWeek } from "@/utils/sets";
import { Set } from "@/types/set";
import { GroupSetsByDate } from "@/types/groupByDay";

export const useChartData = (range: Filter, sets: GroupSetsByDate[]) => {
  const [data, setData] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    if (!sets.length) return setData([]);

    const end = new Date();

    const start = new Date(end);

    if (range === Filter.Weekly) {
      start.setMonth(start.getMonth() - 1);
    }

    if (range === Filter.ThreeMonths) {
      start.setMonth(start.getMonth() - 3);
    }

    if (range === Filter.SixMonths) {
      start.setMonth(start.getMonth() - 5);
    }
    //
    const filtered = sets.filter((e) => {
      const date = new Date(e.date);

      return date >= start && date <= end;
    });

    if (range === Filter.Weekly) {
      const group = setsGroupByWeek(filtered);

      setData(group);
      return;
    }

    const group = setsGroupByMonth(filtered);

    setData(group);
  }, [range, sets]);

  return data;
};
