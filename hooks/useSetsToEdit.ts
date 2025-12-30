import { SetModify } from "@/types/setModify";
import { useState } from "react";

export const useSetsToEdit = () => {
  const [setsToEdit, setSetsToEdit] = useState<SetModify[]>([]);

  const updateOnlyValuesToEdit = ({
    setId,
    weight,
    reps,
  }: {
    setId: number;
    weight?: number;
    reps?: number;
  }) => {
    setSetsToEdit((prevSets) => {
      // Verificar si el set ya existe en el estado
      const existingSet = prevSets.find((set) => set.id === setId);

      if (existingSet) {
        // Actualizar el set específico
        return prevSets.map((set) => {
          if (set.id === setId) {
            if (weight !== undefined) {
              return { ...set, values: { ...set.values, weight } };
            }

            if (reps !== undefined) {
              return { ...set, values: { ...set.values, reps } };
            }
          }

          return set;
        });
      }

      // Si no existe, agregarlo

      return [
        ...prevSets,
        {
          id: setId,
          values: {
            ...(weight !== undefined && { weight }), // Solo incluir si está definido
            ...(reps !== undefined && { reps }),
          },
        },
      ];
    });
  };

  return { setsToEdit, updateOnlyValuesToEdit };
};
