import { NextRequest, NextResponse } from 'next/server';

import { register } from '@/modules/auth';

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const loginInfo = await register(data);
    return NextResponse.json(loginInfo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
