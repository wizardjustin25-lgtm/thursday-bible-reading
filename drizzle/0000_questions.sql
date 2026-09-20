CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`passage` text NOT NULL,
	`content` text NOT NULL,
	`name` text NOT NULL,
	`summary` text,
	`created_at` integer NOT NULL
);

--> statement-breakpoint
CREATE INDEX `idx_questions_created_at` ON `questions` (`created_at`);
