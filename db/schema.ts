import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const questions = sqliteTable("questions", { id:text("id").primaryKey(),passage:text("passage").notNull(),content:text("content").notNull(),name:text("name").notNull(),summary:text("summary"),createdAt:integer("created_at").notNull() }, table=>[index("idx_questions_created_at").on(table.createdAt)]);
