import { db } from "@/db/drizzle";
import { days, routines, sets } from "@/db/schema";
import { FilterSets } from "@/types/filterSets";
import { GroupSetsByDate } from "@/types/groupByDay";
import { Set } from "@/types/set";
import { and, eq, gte, lt, sql } from "drizzle-orm";

type Sets = typeof sets.$inferInsert;
type Block = typeof days.$inferInsert;
type Routine = typeof routines.$inferInsert;
type Group = {
  [date: number]: Set[];
};

export class TrainingFacade {
  static async addRoutine(routine: Routine) {
    await db.insert(routines).values(routine);
  }

  static async removeSet(id: number) {
    return await db.delete(sets).where(eq(sets.id, id));
  }

  static async getLastWorkout(id: number) {
    return await db
      .select()
      .from(sets)
      .where(
        and(lt(sets.date, new Date().getTime()), eq(sets.dayExerciseId, id)),
      );
  }

  static async getRoutines(userId: number) {
    return await db
      .select({
        id: routines.id,
        name: routines.name,
        daysInRoutine: sql<number>`cast(count(${days.id}) as int)`,
      })
      .from(routines)
      .leftJoin(days, eq(routines.id, days.routineId))
      .groupBy(routines.id)
      .where(eq(routines.userId, userId));
  }

  static async getOneBlock(day: number) {
    return await db.select().from(days).where(eq(days.day, day));
  }

  static async updateRoutine(routine: Routine, routineId: number) {
    return await db
      .update(routines)
      .set(routine)
      .where(eq(routines.id, routineId));
  }

  static async removeRoutine(id: number) {
    return await db.delete(routines).where(eq(routines.id, id));
  }

  static async getSets(
    dayExerciseId: number,
    filter: FilterSets,
  ): Promise<GroupSetsByDate[]> {
    if (filter === FilterSets.today) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const setsDb = await db
        .select()
        .from(sets)
        .where(
          and(
            eq(sets.dayExerciseId, dayExerciseId),
            gte(sets.date, start.getTime()),
            lt(sets.date, end.getTime()),
          ),
        );

      const groupByDate = setsDb.reduce<Group>((group, item) => {
        const date = start.getTime();
        if (!group[date]) {
          group[date] = [];
        }

        group[date].push(item);
        return group;
      }, {});

      return Object.keys(groupByDate).map((date) => ({
        date: Number(date),
        sets: groupByDate[Number(date)],
      }));
    }
    if (filter === FilterSets.past) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const currentDay = start.getDate();
      start.setDate(currentDay - 1);

      const setsDb = await db
        .select()
        .from(sets)
        .where(
          and(
            eq(sets.dayExerciseId, dayExerciseId),
            lt(sets.date, start.getTime()),
          ),
        );

      const groupByDate = setsDb.reduce<Group>((group, item) => {
        const date = new Date(item.date);

        date.setHours(0, 0, 0, 0);
        const i = date.getTime();
        if (!group[i]) {
          group[i] = [];
        }

        group[i].push(item);
        return group;
      }, {});

      return Object.keys(groupByDate)
        .map((date) => ({
          date: Number(date),
          sets: groupByDate[Number(date)],
        }))
        .reverse();
    }
    if (filter === FilterSets.all) {
      const setsDb = await db
        .select()
        .from(sets)
        .where(eq(sets.dayExerciseId, dayExerciseId));

      const groupByDate = setsDb.reduce<Group>((group, item) => {
        const date = new Date(item.date);
        date.setHours(0, 0, 0, 0);
        const i = date.getTime();
        if (!group[i]) {
          group[i] = [];
        }

        group[i].push(item);
        return group;
      }, {});

      return Object.keys(groupByDate).map((date) => ({
        date: Number(date),
        sets: groupByDate[Number(date)],
      }));
    }

    return [];
  }

  static async addSet(set: Sets) {
    return await db.insert(sets).values(set);
  }
  static async addBlock(block: Block) {
    return await db.insert(days).values(block);
  }

  static async getExercisesSetsToDay(dayExerciseId: number) {
    return await db
      .select()
      .from(sets)
      .where(eq(sets.dayExerciseId, dayExerciseId));
  }
  static async getBlocks(dayId: number) {
    return await db.select().from(days).where(eq(days.id, dayId));
  }
}
