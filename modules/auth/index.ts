'use server';

import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { TimeSpan } from 'oslo';
import { HMAC } from 'oslo/crypto';
import { createJWT, validateJWT } from 'oslo/jwt';
import { Argon2id } from 'oslo/password';

import { formatError } from '@/util/zodHelpers';

import { db } from '../db';
import { createUserSchema, userTable } from '../users/schema';

import { lucia } from './lucia';
import { loginSchema } from './schema';

let secret: ArrayBuffer;

/**
 * Registers a new user.
 *
 * @param data User registration data containing username and password.
 * @returns A promise resolving to the newly created user's id
 */
export async function register(data: unknown) {
  const result = createUserSchema.safeParse(data);
  if (!result.success) {
    throw new Error(formatError(result.error));
  }
  const { username, password } = result.data;
  const hashedPassword = await new Argon2id().hash(password);
  const userId = nanoid();
  await db
    .insert(userTable)
    .values({ id: userId, username, password: hashedPassword });

  return userId;
}

/**
 * Logs a user in and returns a JWT token.
 *
 * @param data Object containing the username and password.
 * @returns Promise resolving to the user id
 */
export async function login(data: unknown) {
  const result = createUserSchema.safeParse(data);
  if (!result.success) {
    throw new Error(formatError(result.error));
  }
  const { username, password } = result.data;
  const users = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));

  if (users.length === 0) {
    throw new Error('Invalid username or password.');
  }

  const isPasswordValid = await new Argon2id().verify(
    users[0].password,
    password,
  );
  if (!isPasswordValid) {
    throw new Error('Invalid username or password.');
  }

  return users[0].id;
}

/**
 * Generates a JWT token for the given user ID and payload.
 *
 * @param userId The ID of the user
 * @param payload The payload to be included in the JWT token (default is empty object)
 * @return A promise that resolves to the generated JWT token
 */
export async function toJwt(userId: string, payload: any = {}) {
  if (!secret) {
    await new HMAC('SHA-256').generateKey();
  }

  const jwt = await createJWT('HS256', secret, payload, {
    expiresIn: new TimeSpan(7, 'd'),
    issuer: 'lucia',
    subject: userId,
    audiences: ['lucia'],
    includeIssuedTimestamp: true,
  });
  return jwt;
}

/**
 * Validates a JWT bearer token using the secret signing key.
 *
 * @param bearerToken The JWT bearer token to validate.
 * @returns A promise resolving to nothing if valid, rejecting if invalid.
 */
export async function fromJwt(bearerToken: string) {
  if (!secret) {
    await new HMAC('SHA-256').generateKey();
  }

  return validateJWT('HS256', secret, bearerToken);
}

/**
 * Asynchronously creates a session cookie for the given user ID and payload.
 *
 * @param userId The user ID for which the session cookie is to be created.
 * @param payload Optional data payload for the session.
 * @return The created session cookie.
 */
export async function createSessionCookie(userId: string, payload: any = {}) {
  const session = await lucia.createSession(userId, payload);
  const sessionCookie = lucia.createSessionCookie(session.id);
  return sessionCookie;
}
