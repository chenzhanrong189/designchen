CREATE TABLE `portfolio_totals` (
	`metric_key` text PRIMARY KEY NOT NULL,
	`actual_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_visits` (
	`visitor_hash` text NOT NULL,
	`visit_day` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`visitor_hash`, `visit_day`)
);

--> statement-breakpoint
CREATE TRIGGER portfolio_count_on_visit AFTER INSERT ON portfolio_visits
BEGIN
  INSERT INTO portfolio_totals (metric_key, actual_count) VALUES ('portfolio', 1)
  ON CONFLICT(metric_key) DO UPDATE SET actual_count = actual_count + 1;
END;
