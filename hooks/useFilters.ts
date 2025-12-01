import { Filter, Filters } from "@/types/filters";
import { useState } from "react";

export const useFilters = () => {
  const [range, setRange] = useState<Filter>(Filter.Weekly);

  const [filters, setFilters] = useState<Filters[]>([
    {
      range: Filter.Weekly,
      title: "Semanal",
      active: true,
    },
    {
      range: Filter.ThreeMonths,
      title: "3 meses",
      active: false,
    },
    {
      range: Filter.SixMonths,
      title: "6 meses",
      active: false,
    },
  ]);

  const onChangeFilter = (range: Filter) => {
    setFilters((prev) =>
      prev.map((f) =>
        f.range === range ? { ...f, active: true } : { ...f, active: false },
      ),
    );
    setRange(range);
  };

  return { onChangeFilter, filters, range };
};
