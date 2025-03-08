import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// User table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

// Example of another table - this would depend on specific app requirements
export const conversations = sqliteTable('conversations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  title: text('title').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  conversationId: integer('conversation_id').references(() => conversations.id),
  content: text('content').notNull(),
  role: text('role', { enum: ['user', 'assistant'] }).notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
}); 