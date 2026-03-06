import { prisma } from '@/lib/prisma';
import { telegramService } from '@/lib/telegram';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import { getSwapLinks } from '@/lib/utils/chain-utils';

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
        isVip: body.isVip === true,
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

    // Build multi-platform Telegram keyboard (max 2 buttons per row)
    const swapLinks = getSwapLinks(signal.network, signal.contractAddress);
    const emojiMap: Record<string, string> = {
      Jupiter: '⚡️',
      Raydium: '🌊',
      Orca: '🐋',
      Uniswap: '🦄',
      'Jumper (LI.FI)': '🌉',
      '1inch': '🗡️',
      DexScreener: '📊',
    };
    const telegramButtons = swapLinks.map((link) => ({
      text: `${emojiMap[link.name] ?? '🔗'} ${link.name}`,
      url: link.url,
    }));
    const keyboard: { text: string; url: string }[][] = [];
    for (let i = 0; i < telegramButtons.length; i += 2) {
      keyboard.push(telegramButtons.slice(i, i + 2));
    }

    // Format and send Telegram notification
    const telegramMessage = formatSignalMessage(signal);
    await telegramService.sendToSubscribers(telegramMessage, {
      inline_keyboard: keyboard.length > 0 ? keyboard : [
        [{ text: '⚡️ Trade Now', url: `https://jup.ag/swap/SOL-${signal.contractAddress || ''}` }],
      ],
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
  isVip?: boolean;
  targets: Target[];
}

function formatSignalMessage(signal: Signal) {
  const targets = signal.targets
    .sort((a, b) => a.number - b.number)
    .map((t) => `TP${t.number}: $${t.price} (${t.gain}%)`)
    .join('\n');

  const tier = signal.isVip ? '👑 <b>VIP SIGNAL</b>' : '🔓 <b>FREE SIGNAL</b>';

  return `
🚨 <b>New Signal Alert!</b>
${tier}

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
