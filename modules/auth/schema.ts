import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { userTable } from '../users/schema';

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const sessionSchema = createInsertSchema(sessionTable);

export type Session = z.infer<typeof sessionSchema>;

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
