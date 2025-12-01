export type Days =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";

export type Sets = {
  weight: string;
  reps: string;
  rir: string;
  completed: boolean;
};

export type ExercisesBlock = {
  name: string;
  sets: Sets[];
};

type Exercise = {
  name: string;
};

export type Block = {
  name: string;
  exercises: Exercise[];
};

export type Routine = {
  name: string;
  blocks: Block[];
};
