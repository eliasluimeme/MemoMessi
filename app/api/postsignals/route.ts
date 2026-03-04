import { prisma } from '@/lib/prisma';
import { telegramService } from '@/lib/telegram';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || (session.role !== 'ADMIN' && session.role !== 'PRIVATE')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.pair || !body.entryZone || !body.takeProfit)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const signal = await prisma.signal.create({
      data: {
        pair: body.pair,
        entryZone: body.entryZone,
        stopLoss: body.stopLoss,
        note: body.note,
        contractAddress: body.contractAddress,
        network: body.network || 'solana',
        status: 'WITHIN_ENTRY_ZONE',
        targets: {
          create: body.takeProfit.map((target: { price: number; gain: number }, index: number) => ({
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

    // Format and send Telegram notification
    const telegramMessage = formatSignalMessage(signal);
    await telegramService.sendToSubscribers(telegramMessage, {
      inline_keyboard: [
        [
          {
            text: '⚡️ Trade Now',
            url: signal.network === 'solana'
              ? `https://jup.ag/swap/SOL-${signal.contractAddress}`
              : `https://app.uniswap.org/#/swap?outputCurrency=${signal.contractAddress}&chain=${signal.network || 'base'}`
          }
        ]
      ]
    });

    return NextResponse.json(signal, { status: 201 });
  } catch (error) {
    console.error('Error creating signal:', error);
    return NextResponse.json({ error: 'Failed to create signal' }, { status: 500 });
  }
}

interface Target {
  number: number;
  price: number;
  gain: number;
}

interface Signal {
  pair: string;
  action: string;
  entryZone: number;
  stopLoss: number | null;
  note: string | null;
  contractAddress?: string | null;
  network?: string | null;
  targets: Target[];
}

function formatSignalMessage(signal: Signal) {
  const targets = signal.targets
    .sort((a, b) => a.number - b.number)
    .map((t) => `TP${t.number}: $${t.price} (${t.gain}%)`)
    .join('\n');

  return `
🚨 <b>New Signal Alert!</b>

📊 <b>Pair:</b> ${signal.pair}
🌐 <b>Network:</b> ${signal.network?.toUpperCase() || 'SOLANA'}
📈 <b>Action:</b> ${signal.action}
💰 <b>Entry Zone:</b> $${signal.entryZone}
🛑 <b>Stop Loss:</b> ${signal.stopLoss ? `$${signal.stopLoss}` : 'N/A'}

${signal.contractAddress ? `📄 <b>CA:</b> <code>${signal.contractAddress}</code>\n` : ''}
🎯 <b>Targets:</b>
${targets}

📝 <b>Note:</b> ${signal.note || 'N/A'}

⚠️ <i>Always do your own research accordingly.</i>`;
}
