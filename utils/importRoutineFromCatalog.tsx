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
  // const docRef = doc(firestore, "catalog-routines", code);
  //
  // const routineSnap = await getDoc(docRef);
  //
  // if (!routineSnap.exists()) {
  //   return;
  // }
  //
  // const routine = routineSnap.data();
  //
  // const [{ rouId }] = await drizzleDb
  //   .insert(routines)
  //   .values({
  //     name: routine.name,
  //     userId,
  //   })
  //   .returning({ rouId: routines.id });
  //
  // const daysInsert = routine.days.map((d: Days) => ({
  //   name: d.name,
  //   routineId: rouId,
  //   day: d.day,
  // }));
  //
  // const exercisesInsert = Array.from(
  //   new Set(
  //     routine.days.flatMap((d) =>
  //       d.exercises.map((e) => ({ name: e.name })),
  //     ),
  //   ),
  // );
  //
  // const listDays = await drizzleDb
  //   .insert(days)
  //   .values(daysInsert)
  //   .returning({ id: days.id, name: days.name, day: days.day });
  //
  // const listExercises = await drizzleDb
  //   .insert(exercises)
  //   .values(exercisesInsert)
  //   .returning({ name: exercises.name, id: exercises.id });
  //
  // const daysExercisesInsert = routine.days.flatMap((d) =>
  //   d.exercises.map((e) => {
  //     const dayId = listDays.find((ld) => ld.day === d.day)?.id;
  //     const exerciseId = listExercises.find((el) => el.name === e.name)?.id;
  //     return { dayId, exerciseId };
  //   }),
  // );
  //
  // const daysExercisesReturn = await drizzleDb
  //   .insert(daysExcercises)
  //   .values(daysExercisesInsert)
  //   .returning({
  //     dayExerciseId: daysExcercises.id,
  //     exerciseId: daysExcercises.exerciseId,
  //     dayId: daysExcercises.dayId,
  //   });
  //
  // const date = new Date();
  //
  // const setsInsert = routine.days.flatMap((d) =>
  //   d.exercises.flatMap((e) => {
  //     const exerciseId = listExercises.find((el) => el.name === e.name)?.id;
  //     const dayId = listDays.find((ld) => ld.day === d.day)?.id;
  //
  //     const dayExerciseId = daysExercisesReturn.find(
  //       (d) => d.exerciseId === exerciseId && d.dayId === dayId,
  //     )?.dayExerciseId;
  //
  //     return Array.from({ length: e.sets }).map(() => ({
  //       dayExerciseId: dayExerciseId as number,
  //       reps: e.reps as number,
  //       weight: 0,
  //       date: date.getTime(),
  //     }));
  //   }),
  // );
  // await drizzleDb.insert(sets).values(setsInsert);
};
