'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createSessionCookie, register } from '@/modules/auth';

export async function onSubmit(oldState: any, formData: FormData) {
  try {
    const userId = await register(Object.fromEntries(formData));
    const cookie = await createSessionCookie(userId);
    cookies().set(cookie.name, cookie.value, cookie.attributes);
  } catch (error: any) {
    return { error: error.message };
  }
  return redirect('/'); // NextJs uses errors for redirects
}
