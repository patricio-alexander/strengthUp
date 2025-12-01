import { sets } from "@/db/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
type SetsTable = typeof sets.$inferSelect;

interface GroupByDay {
  date: number;
  weight: number;
  reps: number;
}

export const setsGroupByMonth = (sets: SetsTable[]) => {
  const months = sets.reduce<Record<string, number[]>>((group, item) => {
    const d = new Date(item.date);
    const key = format(d, "MMM yyyy", { locale: es });
    const vol = item.reps * item.weight;

    if (!group[key]) {
      group[key] = [];
    }
    group[key].push(vol);

    return group;
  }, {});

  const result = Object.entries(months).map(([label, scores]) => ({
    label,
    value: scores.reduce((acc, curr) => acc + curr, 0) / scores.length,
  }));
  return result;
};

const getWeekStartDay = (d: number) => {
  const date = new Date(d);
  const day = date.getDay();

  const diff = date.getDate() - day + (day === 0 ? -7 : 0);

  const weekStart = new Date(date.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.getTime();
};

export const setsGroupByWeek = (weeksInCurrentMonth: SetsTable[]) => {
  const groupByWeek = weeksInCurrentMonth.reduce<Record<string, number[]>>(
    (group, item) => {
      const getDay = getWeekStartDay(item.date);

      if (!group[getDay]) {
        group[getDay] = [];
      }
      const vol = item.reps * item.weight;
      group[getDay].push(vol);

      return group;
    },
    {},
  );

  const result = Object.entries(groupByWeek).map(([date, scores]) => {
    const d = new Date(Number(date));

    const c = d.getDate() + 6;
    const endDay = new Date();
    endDay.setDate(c);

    const startWeek = format(new Date(Number(date)), "dd", {
      locale: es,
    });
    const endWeek = format(new Date(Number(endDay)), "dd", {
      locale: es,
    });

    return {
      label: `${startWeek} al ${endWeek}`,
      value: scores.reduce((acc, curr) => acc + curr, 0) / scores.length,
    };
  });

  return result;
};

export const setsGroupByDay = (data: SetsTable[]) => {
  const days = data.reduce<Record<string, GroupByDay[]>>((group, item) => {
    const d = new Date(item.date);
    d.setHours(0, 0, 0, 0);
    const key = format(d, "MMM dd yyyy", { locale: es });
    const { date, reps, weight } = item;

    if (!group[key]) {
      group[key] = [];
    }
    group[key].push({
      date,
      reps,
      weight,
    });

    return group;
  }, {});

  const result = Object.entries(days).map(([label, sets]) => ({
    label,
    sets,
  }));

  return result;
};
