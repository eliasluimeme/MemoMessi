import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { telegramService } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const internalToken = headersList.get('x-internal-token');

    // Verify internal token
    if (internalToken !== process.env.INTERNAL_WEBHOOK_TOKEN) {
      console.error('Invalid internal token');
      return new NextResponse('Forbidden', { status: 403 });
    }

    const update = await req.json();

    // Process the update
    await telegramService.handleUpdate(update);

    if (process.env.NODE_ENV === 'development') {
      console.log('\nUpdate processed successfully');
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('\nError processing webhook:', error);
    return new NextResponse('Error', { status: 500 });
  }
} 