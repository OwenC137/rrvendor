CREATE TABLE `sales` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`amount` real NOT NULL,
	`unit_price` text,
	`quantity` real NOT NULL,
	`client` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
