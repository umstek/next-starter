import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { TimeSpan } from 'oslo';
import { HMAC } from 'oslo/crypto';
import { createJWT, validateJWT } from 'oslo/jwt';
import { Argon2id } from 'oslo/password';

import { db } from '../db';
import { createUserSchema, userTable } from '../users/schema';

import { loginSchema } from './schema';

const secret = await new HMAC('SHA-256').generateKey();

/**
 * Registers a new user.
 *
 * @param data User registration data containing username and password.
 * @returns A promise resolving to an object containing the new JWT token.
 */
export async function register(data: unknown) {
  const { username, password } = createUserSchema.parse(data);
  const hashedPassword = await new Argon2id().hash(password);
  const userId = nanoid();
  await db
    .insert(userTable)
    .values({ id: userId, username, password: hashedPassword });

  const jwt = await createJWT(
    'HS256',
    secret,
    {},
    {
      expiresIn: new TimeSpan(7, 'd'),
      issuer: 'lucia',
      subject: userId,
      audiences: ['lucia'],
      includeIssuedTimestamp: true,
    },
  );
  return { token: jwt };
}

/**
 * Logs a user in and returns a JWT token.
 *
 * @param data Object containing the username and password.
 * @returns Promise resolving to an object containing the JWT token.
 */
export async function login(data: unknown) {
  const { username, password } = loginSchema.parse(data);
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

  const jwt = await createJWT(
    'HS256',
    secret,
    {},
    {
      expiresIn: new TimeSpan(7, 'd'),
      issuer: 'lucia',
      subject: users[0].id,
      audiences: ['lucia'],
      includeIssuedTimestamp: true,
    },
  );
  return { token: jwt };
}

/**
 * Validates a JWT bearer token using the secret signing key.
 *
 * @param bearerToken The JWT bearer token to validate.
 * @returns A promise resolving to nothing if valid, rejecting if invalid.
 */
export async function validate(bearerToken: string) {
  return validateJWT('HS256', secret, bearerToken);
}
