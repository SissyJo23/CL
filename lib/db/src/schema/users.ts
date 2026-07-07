import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  password: text("password").notNull(),
  userMode: text("user_mode").notNull().default("attorney"), // inmate, advocate, attorney, appellate
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
