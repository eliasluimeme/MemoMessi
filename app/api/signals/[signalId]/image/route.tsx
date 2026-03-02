import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';


export async function GET(
    request: Request,
    { params }: { params: { signalId: string } }
) {
    try {
        const id = params.signalId;

        if (!id) {
            return new Response('Missing signal ID', { status: 400 });
        }

        const signal = await prisma.signal.findUnique({
            where: { id },
            include: {
                targets: {
                    orderBy: { number: 'asc' },
                },
            },
        });

        if (!signal) {
            return new Response('Signal not found', { status: 404 });
        }

        // Cast to any to bypass temporary type sync issues with prisma client
        const s = signal as any;

        const isBuy = s.action === 'BUY';
        const mainColor = isBuy ? '#10b981' : '#ef4444';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#030712',
                        padding: '40px',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '-10%',
                            left: '-10%',
                            width: '400px',
                            height: '400px',
                            backgroundColor: mainColor,
                            opacity: 0.1,
                            borderRadius: '100%',
                            filter: 'blur(100px)',
                            display: 'flex',
                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            backgroundColor: 'rgba(31, 41, 55, 0.5)',
                            border: '1px solid rgba(75, 85, 99, 0.3)',
                            borderRadius: '24px',
                            padding: '40px',
                            color: 'white',
                            position: 'relative',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', width: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', letterSpacing: '-0.05em', display: 'flex' }}>
                                    {s.pair}
                                </div>
                                <div style={{ fontSize: '20px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', display: 'flex' }}>
                                    {s.network?.toUpperCase() || 'SOLANA'} • {s.market}
                                </div>
                            </div>
                            <div
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: mainColor,
                                    borderRadius: '100px',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                }}
                            >
                                {s.action}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', width: '100%' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <div style={{ fontSize: '14px', color: '#10b981', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', display: 'flex' }}>Entry Zone</div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', display: 'flex' }}>${s.entryZone}</div>
                            </div>
                            {s.stopLoss && (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    <div style={{ fontSize: '14px', color: '#ef4444', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', display: 'flex' }}>Stop Loss</div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold', display: 'flex' }}>${s.stopLoss}</div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '8px', display: 'flex' }}>TARGETS</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {s.targets.slice(0, 4).map((target: any, i: number) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#374151', padding: '12px 20px', borderRadius: '12px', border: '1px solid #4b5563' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', marginRight: '10px', display: 'flex' }}>TP{target.number}</div>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex' }}>${target.price.toFixed(6).replace(/\.?0+$/, '')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(75, 85, 99, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', display: 'flex' }}>
                                    memo<span style={{ color: '#3b82f6', display: 'flex' }}>messi</span>
                                </div>
                            </div>
                            <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex' }}>www.memomessi.com</div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (error) {
        console.error(error);
        return new Response('Failed to generate image', { status: 500 });
    }
}
