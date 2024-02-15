import { NextRequest, NextResponse } from 'next/server';

import { register, toJwt } from '@/modules/auth';

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const jwt = await toJwt(await register(data));
    return NextResponse.json({ token: jwt }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
