CREATE TABLE `request_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`hits` integer NOT NULL,
	`expires_at` integer NOT NULL
);

--> statement-breakpoint
CREATE INDEX `idx_request_limits_expires_at` ON `request_limits` (`expires_at`);
--> statement-breakpoint
ALTER TABLE `questions` ADD `summary_status` text DEFAULT 'unavailable' NOT NULL;
