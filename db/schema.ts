import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const settings = sqliteTable("settings", {
  id: int("id").primaryKey({ autoIncrement: true }),
  key: text("key").unique(),
  value: text("value"),
});

export const users = sqliteTable("users", {
  id: int("userId").primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  loggedIn: int({ mode: "boolean" }).default(true),
});

export const routines = sqliteTable("routines", {
  id: int("routineId").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  userId: int("user_id"),
});

export const days = sqliteTable("days", {
  id: int("id").primaryKey({ autoIncrement: true }),
  sorted: int("sorted"),
  name: text("name").notNull(),
  routineId: int("routine_id")
    .notNull()
    .references(() => routines.id, { onDelete: "cascade" }),
  day: int("day"),
});

export const exercises = sqliteTable("exercises", {
  id: int("exerciseId").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const messages = sqliteTable("messages", {
  id: int("messageId").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(),
  content: text("content").notNull(),
});

export const daysExcercises = sqliteTable("days_exercises", {
  id: int("day_exercise_id").primaryKey({ autoIncrement: true }),
  dayId: int("day_id")
    .notNull()
    .references(() => days.id, { onDelete: "cascade" }),
  exerciseId: int("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  sorted: int("sorted"),
});

export const sets = sqliteTable("sets", {
  id: int("id").primaryKey({ autoIncrement: true }),
  dayExerciseId: int("day_exercice_id")
    .notNull()
    .references(() => daysExcercises.id, { onDelete: "cascade" }),
  reps: int("reps").notNull(),
  weight: int("weight").notNull(),
  date: int("date").notNull(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  routines: many(routines),
}));

export const routinesRelations = relations(routines, ({ one, many }) => ({
  users: one(users, {
    fields: [routines.userId],
    references: [users.id],
  }),
  days: many(days),
}));

export const daysRelations = relations(days, ({ one, many }) => ({
  routine: one(routines, {
    fields: [days.routineId],
    references: [routines.id],
  }),
  daysExcercices: many(daysExcercises),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  daysExcercices: many(daysExcercises),
}));

export const daysExcercicesRelations = relations(
  daysExcercises,
  ({ one, many }) => ({
    days: one(days, {
      fields: [daysExcercises.dayId],
      references: [days.id],
    }),

    exercises: one(exercises, {
      fields: [daysExcercises.exerciseId],
      references: [exercises.id],
    }),

    sets: many(sets),
  }),
);

export const setsRelations = relations(sets, ({ one }) => ({
  sets: one(daysExcercises, {
    fields: [sets.dayExerciseId],
    references: [daysExcercises.id],
  }),
}));
