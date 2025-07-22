import { InferModel } from "drizzle-orm";
import { pgTable, serial, primaryKey, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name"),
	email: text("email").unique().notNull(),
	password: text("password").notNull(),
});

export type User = InferModel<typeof usersTable>;
