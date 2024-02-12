import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull().default(''),
});

// Use drizzle-zod to convert drizzle schema to zod schema.
// If we retrieve a record from this table, it must adhere to the ts type
export const userSchema = createInsertSchema(userTable).required({
  password: true,
});

export const createUserSchema = createInsertSchema(userTable, {
  password: (schema) => schema.password.min(6).max(255),
  username: (schema) =>
    schema.username
      .regex(/^[a-z0-9_-]+$/i)
      .min(3)
      .max(31),
})
  .omit({
    id: true,
  })
  .required({
    password: true,
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Use zod to convert zod schema to typescript type
export type User = z.infer<typeof userSchema>;
