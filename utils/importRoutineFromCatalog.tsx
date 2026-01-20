import { supabase } from "@/lib/supabase";

type sets = {
  reps: number;
  weight: number;
};

type Days = {
  name: string;
  exercises: Array<string>;
  sets: sets[];
  day: number;
};

export const importRoutieFromCatalog = async ({
  code,
  userId,
}: {
  code: string;
  userId: number;
}) => {
  const { data } = await supabase
    .from("catalog_routines")
    .select()
    .eq("id", code)
    .single();

  if (!data) {
    return;
  }

  const { data: routine } = await supabase
    .from("routines")
    .insert({ name: data.name, user_id: userId })
    .select()
    .single();

  const workoutsToInsert = data.days.map((r) => ({
    routine_id: routine.id,
    name: r.name,
    day: r.day,
    sorted: 0,
  }));

  const exercisesInsert = Array.from(
    new Set(
      data.days.flatMap((d) =>
        d.exercises.map((e) => ({ name: e.name, user_id: userId })),
      ),
    ),
  );

  const { data: workoutsSessions } = await supabase
    .from("workout_sessions")
    .insert(workoutsToInsert)
    .select();

  const { data: userExercises } = await supabase
    .from("user_exercises")
    .insert(exercisesInsert)
    .select();

  const workoutExercisesInsert = data.days.flatMap((d) =>
    d.exercises.map((e) => {
      const workoutId = workoutsSessions.find((ld) => ld.day === d.day)?.id;
      const exerciseId = userExercises.find((el) => el.name === e.name)?.id;
      return { workout_id: workoutId, exercise_id: exerciseId };
    }),
  );

  const { data: workoutSessionsExercises } = await supabase
    .from("workout_sessions_exercises")
    .insert(workoutExercisesInsert)
    .select();

  const date = new Date().toISOString();

  const setsInsert = data.days.flatMap((d) =>
    d.exercises.flatMap((e) => {
      const exerciseId = userExercises.find((el) => el.name === e.name)?.id;
      const workoutId = workoutsSessions.find((ld) => ld.day === d.day)?.id;

      const workoutSessionExerciseId = workoutSessionsExercises.find(
        (d) => d.exercise_id === exerciseId && d.workout_id === workoutId,
      )?.id;

      return Array.from({ length: e.sets }).map(() => ({
        workout_session_exercise_id: workoutSessionExerciseId,
        reps: e.reps as number,
        weight: 0,
        performed_at: date,
      }));
    }),
  );

  await supabase.from("exercise_sets").insert(setsInsert);
};
