import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';

import { lucia } from '@/modules/auth/lucia';
import { google } from '@/modules/auth/providers';
import { db } from '@/modules/db';
import { userTable } from '@/modules/users/schema';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('google_oauth_state')?.value ?? null;
  const storedCodeVerifier =
    cookies().get('google_oauth_code_verifier')?.value ?? '';

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    const googleUserResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const googleUser: GoogleUser = await googleUserResponse.json();

    const existingUsers = await db
      .select()
      .from(userTable)
      .where(eq(userTable.googleId, googleUser.sub));

    // Delete the state and code verifier cookies
    cookies().delete('google_oauth_state');
    cookies().delete('google_oauth_code_verifier');

    if (existingUsers.length > 0) {
      const session = await lucia.createSession(existingUsers[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
        },
      });
    }

    const userId = nanoid();

    await db.insert(userTable).values({
      id: userId,
      googleId: googleUser.sub,
      username: googleUser.email,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GoogleUser {
  // https://developers.google.com/identity/openid-connect/openid-connect#an-id-tokens-payload
  sub: string;
  email: string;
}
