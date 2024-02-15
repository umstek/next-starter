import { NextRequest, NextResponse } from 'next/server';

import { login, toJwt } from '@/modules/auth';

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const jwt = await toJwt(await login(data));
    return NextResponse.json({ token: jwt }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
