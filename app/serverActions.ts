'use server';

import { redirect } from 'next/navigation';

export async function goToHome() {
  redirect(`/`);
}

export async function goToLogin() {
  redirect(`/login`);
}

export async function goToRegister() {
  redirect(`/register`);
}
