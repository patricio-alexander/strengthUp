CREATE TABLE `days` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`routine_id` integer NOT NULL,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`routineId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `days_exercises` (
	`day_exercise_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	FOREIGN KEY (`day_id`) REFERENCES `days`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`exerciseId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`exerciseId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routines` (
	`routineId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`user_id` integer
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day_exercice_id` integer NOT NULL,
	`reps` integer NOT NULL,
	`weight` integer NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`day_exercice_id`) REFERENCES `days_exercises`(`day_exercise_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`userId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL
);
