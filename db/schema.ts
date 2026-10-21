import { pgTable, pgEnum, serial, varchar, integer, text, jsonb,
    timestamp, unique } from "drizzle-orm/pg-core";

import {MenuPage as RawPageData} from "@/config/schemas/menupage";
import {MenuData} from "@/config/schemas/MenuData";

export const menuStatus = pgEnum("menu_status", ["processing", "ready", "failed"]);
export const pageStatus = pgEnum("page_status", ["pending", "processing", "done", "failed"]);

export const menus = pgTable("menus", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    theme: varchar("theme", { length: 30 }).notNull().default("classic"),
    status: menuStatus("status").notNull().default("processing"),
    data: jsonb("data").$type<MenuData>(),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const menuPages = pgTable("menu_pages", {
    id: serial("id").primaryKey(),
    menuId: integer("menu_id").notNull().references(() => menus.id, { onDelete: "cascade" }),
    pageNumber: integer("page_number").notNull(),
    status: pageStatus("status").notNull().default("pending"),
    error: text("error"),
    imagePath: text("image_path"),
    data: jsonb("data").$type<RawPageData>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [unique().on(t.menuId, t.pageNumber)]);