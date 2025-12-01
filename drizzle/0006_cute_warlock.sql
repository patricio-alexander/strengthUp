PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day_exercice_id` integer NOT NULL,
	`reps` integer NOT NULL,
	`weight` integer NOT NULL,
	`date` integer NOT NULL,
	FOREIGN KEY (`day_exercice_id`) REFERENCES `days_exercises`(`day_exercise_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sets`("id", "day_exercice_id", "reps", "weight", "date") SELECT "id", "day_exercice_id", "reps", "weight", "date" FROM `sets`;--> statement-breakpoint
DROP TABLE `sets`;--> statement-breakpoint
ALTER TABLE `__new_sets` RENAME TO `sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;