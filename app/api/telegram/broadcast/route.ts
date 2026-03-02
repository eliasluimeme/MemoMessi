import { NextResponse } from 'next/server';
import { telegramService } from '@/lib/telegram';
import { isAuthenticated } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const session = await isAuthenticated();
    if (!session?.role || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    const result = await telegramService.sendToSubscribers(message);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
} 