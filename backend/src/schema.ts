import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

// to generate id use uuid
// register , sign in,

// route/organization page - user mUST be logged in - this will select all organizations(db.select()) for which user is in  (to create organization - free plan default)
// create new -> /organization/create -> inform organization has 14 day of free trial
// display

export const users_table = sqliteTable("users", {
  id: text("id", { length: 15 }).notNull().primaryKey(),
  email: text("email", { length: 100 }).notNull(),
  password: text("pasword", { length: 200 }).notNull(),
  fullname: text("fullname", { length: 100 }).notNull(),
});

export const organizations_table = sqliteTable("organizations", {
  id: text("id", { length: 15 }).notNull().primaryKey(),
  name: text("name", { length: 100 }).notNull(),
  plan: text("plan", { enum: ["basic", "standard", "plus"] }).notNull(),
});

export const organizations_users_table = sqliteTable("organizations_users", {
  user_id: text("user_id", { length: 15 })
    .notNull()
    .references(() => users_table.id),
  organization_id: text("organization_id", { length: 15 })
    .notNull()
    .references(() => organizations_table.id),
  role: text("role", { enum: ["admin", "member"] }).notNull(),
});

export const transactions_table = sqliteTable("transactions", {
  id: text("id", { length: 15 }).notNull().primaryKey(),
  user_id: text("user_id", { length: 15 })
    .notNull()
    .references(() => users_table.id),
  plan: text("plan", { enum: ["basic", "standard", "plus"] }).notNull(),
  time_stamp: int("time_stamp", { mode: "timestamp" }).notNull(),
  amount: int("amount").notNull(),
  organization_id: text("organization_id", { length: 15 })
    .notNull()
    .references(() => organizations_table.id),
});
