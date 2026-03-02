import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// import { prisma } from '@/lib/prisma';

// TODO: this file might be removed
export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));

    // if (!payload.id) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    // const subscription = await prisma.subscription.findFirst({
    //   where: {
    //     userId: payload.id as string,
    //   },
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
    //   select: {
    //     id: true,
    //     status: true,
    //     plan: true,
    //     expiresAt: true,
    //   },
    // });

    return NextResponse.json({});
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
