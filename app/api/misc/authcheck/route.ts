import { NextRequest, NextResponse } from 'next/server';

import { validate } from '@/modules/auth';

export async function GET(request: NextRequest) {
  // Unfortunately, you'll prefix all the routes that need to be protected with
  // these two lines or equivalent and it's easy to forget.
  const bearerToken = request.headers.get('authorization')?.split(' ')[1] ?? '';
  const jwtDecoded = await validate(bearerToken);

  return NextResponse.json(jwtDecoded);
}
