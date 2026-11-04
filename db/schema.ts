import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const portfolioVisits = sqliteTable("portfolio_visits", {
  visitorHash: text("visitor_hash").notNull(),
  visitDay: text("visit_day").notNull(),
  createdAt: integer("created_at").notNull(),
}, table => [primaryKey({ columns: [table.visitorHash, table.visitDay] })]);

export const portfolioTotals = sqliteTable("portfolio_totals", {
  metricKey: text("metric_key").primaryKey(),
  actualCount: integer("actual_count").notNull().default(0),
});
