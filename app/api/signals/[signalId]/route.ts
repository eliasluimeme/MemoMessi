import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateSignalSchema = z.object({
  pair: z.string().min(1),
  market: z.string(),
  action: z.enum(['BUY', 'SELL']),
  entryZone: z.number(),
  stopLoss: z.number().nullable(),
  takeProfit: z.array(
    z.object({
      price: z.number(),
      gain: z.number(),
    }),
  ),
  note: z.string(),
});

async function checkAdmin() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const role = user.user_metadata.role || 'USER';
  if (role !== 'ADMIN') return null;
  return user;
}

export async function DELETE(req: Request, { params }: { params: { signalId: string } }) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.signal.delete({
      where: { id: params.signalId },
    });

    return NextResponse.json({ message: 'Signal deleted successfully' });
  } catch (error) {
    console.error('[SIGNAL_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { signalId: string } }) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateSignalSchema.parse(body);

    const updatedSignal = await prisma.signal.update({
      where: { id: params.signalId },
      data: {
        pair: validatedData.pair,
        market: validatedData.market,
        action: validatedData.action,
        entryZone: validatedData.entryZone,
        stopLoss: validatedData.stopLoss,
        note: validatedData.note,
        targets: {
          deleteMany: {},
          create: validatedData.takeProfit.map((target, index) => ({
            number: index + 1,
            price: target.price,
            hit: false,
            gain: target.gain,
          })),
        },
      },
      include: {
        targets: true,
      },
    });

    return NextResponse.json(updatedSignal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }
    console.error('[SIGNAL_UPDATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { signalId: string } }) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (status !== 'CLOSED') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedSignal = await prisma.signal.update({
      where: { id: params.signalId },
      data: {
        status,
        isClosed: true,
        closedAt: new Date(),
      },
    });

    return NextResponse.json(updatedSignal);
  } catch (error) {
    console.error('[SIGNAL_CLOSE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
