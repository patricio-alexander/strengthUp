import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Set } from "@/types/set";
import { GroupSetsByDate } from "@/types/groupByDay";

export const setsGroupByMonth = (sets: GroupSetsByDate[]) => {
  const months = sets.reduce<Record<string, number[]>>((group, item) => {
    const d = new Date(item.date);
    const key = d.toISOString();
    const vol = item.sets.reduce(
      (acc, curr) => acc + curr.reps * curr.weight,
      0,
    );

    if (!group[key]) {
      group[key] = [];
    }
    group[key].push(vol);

    return group;
  }, {});

  const result = Object.entries(months).map(([date, scores]) => ({
    label: format(new Date(date), "MMM yyyy", { locale: es }),
    value: scores.reduce((acc, curr) => acc + curr, 0) / scores.length,
  }));
  return result;
};

const getWeekStartDay = (d: string) => {
  const date = new Date(d);
  const day = date.getDay();

  const diff = date.getDate() - day + (day === 0 ? -7 : 0);

  const weekStart = new Date(date.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.getTime();
};

export const setsGroupByWeek = (weeksInCurrentMonth: GroupSetsByDate[]) => {
  const groupByWeek = weeksInCurrentMonth.reduce<Record<string, number[]>>(
    (group, item) => {
      const getDay = getWeekStartDay(item.date);

      if (!group[getDay]) {
        group[getDay] = [];
      }
      const vol = item.sets.reduce(
        (acc, curr) => acc + curr.reps * curr.weight,
        0,
      );

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

export const setsGroupByDay = (data: Set[]) => {
  const days = data.reduce<Record<string, Set[]>>((group, item) => {
    const d = new Date(item.performed_at);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString();
    const { performed_at, reps, weight, id } = item;

    if (!group[key]) {
      group[key] = [];
    }
    group[key].push({
      performed_at,
      reps,
      weight,
      id,
    });

    return group;
  }, {});

  const result = Object.entries(days).map(([date, sets]) => ({
    date,
    sets,
  }));

  return result;
};
