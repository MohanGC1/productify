import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

//Relations define how tables connect to each other. This enables Drizzle's query API
//to automatically join related tables data when using with : { relationsName : true }

// Users Relations : A user can have many products and many comments
// many() means one user can have multiple related records

export const userRelations = relations(users, ({ many }) => ({
  products: many(products), //One User -> many products
  comments: many(comments), //One User -> many comments
}));

//Products Relations : a product belongs to one user and can have many comments
//`One()` means a single related record, `many()` means multiple related records

export const productRelations = relations(products, ({ one, many }) => ({
  comments: many(comments),
  //`fields` : the foreign key column in This table (products.userId)
  // `references` : the primary key column in the related table (users.id)
  user: one(users, { fields: [products.userId], references: [users.id] }),
}));

// Comments Relations : a comment belongs to one user and one product
export const commentRelations = relations(comments, ({ one }) => ({
  //`comments.userId` is the foreign key , `users.id` is the primary key
  user: one(users, { fields: [comments.userId], references: [users.id] }), //One Comment -> One User
  //`comments.productId` is the foreign key , `products.id` is the primary key
  product: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }), //One Comment -> One Product
}));

//Type inference
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferInsert;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
