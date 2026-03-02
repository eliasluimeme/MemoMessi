// import { NextRequest } from 'next/server';
// import WebSocket from 'ws';

// let wsClient: WebSocket | null = null;
// let isConnecting = false;
// let activeChannels: string[] = [];

// interface Trade {
//   price: number;
//   time: number;
// }

// interface OHLC {
//   timestamp: number;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume: number;
// }

// class CandleAggregator {
//   private currentCandle: OHLC | null = null;
//   private readonly interval: number = 60000; // 1 minute in milliseconds

//   addTrade(trade: Trade): OHLC | null {
//     const candleTimestamp = Math.floor(trade.time / this.interval) * this.interval;

//     // If this is a new candle period or first trade
//     if (!this.currentCandle || candleTimestamp > this.currentCandle.timestamp) {
//       // Emit the completed candle if exists
//       const completedCandle = this.currentCandle;
      
//       // Start a new candle
//       this.currentCandle = {
//         timestamp: candleTimestamp,
//         open: trade.price,
//         high: trade.price,
//         low: trade.price,
//         close: trade.price,
//         volume: 1
//       };

//       return completedCandle;
//     }

//     // Update existing candle
//     this.currentCandle.high = Math.max(this.currentCandle.high, trade.price);
//     this.currentCandle.low = Math.min(this.currentCandle.low, trade.price);
//     this.currentCandle.close = trade.price;
//     this.currentCandle.volume += 1;

//     return null;
//   }

//   getCurrentCandle(): OHLC | null {
//     return this.currentCandle;
//   }
// }

// const candleAggregator = new CandleAggregator();

// function connectToCoinAPI(channels: string[]) {
//   if (isConnecting) return;
  
//   if (wsClient?.readyState === WebSocket.OPEN) {
//     wsClient.close();
//     wsClient = null;
//   }

//   isConnecting = true;
//   wsClient = new WebSocket('wss://ws.coinapi.io/v1/');

//   wsClient.onopen = () => {
//     console.log('Connected to CoinAPI WebSocket');
//     isConnecting = false;
    
//     const subscribeMessage = {
//       type: 'hello',
//       apikey: process.env.COINAPI_KEY,
//       heartbeat: true,
//       subscribe_data_type: ['trade'],
//       subscribe_filter_symbol_id: ['BITSTAMP_SPOT_BTC_USD'],
//     };
    
//     console.log('Sending subscription message to CoinAPI:', {
//       ...subscribeMessage,
//       apikey: '***' // Hide API key in logs
//     });

//     if (wsClient?.readyState === WebSocket.OPEN) {
//       wsClient.send(JSON.stringify(subscribeMessage));
//     }
//   };

//   wsClient.onmessage = async (event) => {
//     try {
//       const message = JSON.parse(event.data.toString());
//       console.log('Raw CoinAPI message:', JSON.stringify(message, null, 2));
      
//       const io = (global as any).io;
//       if (!io) {
//         console.error('Socket.IO server not initialized');
//         return;
//       }

//       // Handle different message types
//       switch (message.type) {
//         case 'error':
//           console.error('CoinAPI error message:', message);
//           break;

//         case 'hearbeat':
//         case 'heartbeat':
//           console.log('Received heartbeat from CoinAPI');
//           break;

//         case 'trade':
//           console.log('Processing trade message:', message);
//           const trade: Trade = {
//             price: message.price,
//             time: new Date(message.time_exchange || message.time).getTime()
//           };

//           // Add trade to aggregator
//           const completedCandle = candleAggregator.addTrade(trade);
          
//           // Emit completed candle if available
//           if (completedCandle) {
//             console.log('Emitting completed candle:', completedCandle);
//             io.emit('ohlc-update', completedCandle);
//           }

//           // Also emit current candle for real-time updates
//           const currentCandle = candleAggregator.getCurrentCandle();
//           if (currentCandle) {
//             console.log('Emitting current candle:', currentCandle);
//             io.emit('current-candle-update', currentCandle);
//           }

//           // Emit individual trade for price ticker
//           const priceUpdate = {
//             type: 'price',
//             content: `${message.symbol_id}:${message.price}`,
//             timestamp: trade.time,
//           };
//           console.log('Emitting price update:', priceUpdate);
//           io.emit('price-update', priceUpdate);
//           break;

//         default:
//           console.log('Received unknown message type:', message.type);
//           break;
//       }
//     } catch (error) {
//       console.error('Error processing CoinAPI message:', error);
//       console.error('Raw message data:', event.data);
//     }
//   };

//   wsClient.onerror = (error) => {
//     console.error('CoinAPI WebSocket error:', error);
//     isConnecting = false;
//   };

//   wsClient.onclose = (event) => {
//     console.log('CoinAPI WebSocket closed:', event.code, event.reason);
//     isConnecting = false;
//     // Only reconnect if we're not closing intentionally
//     if (event.code !== 1000) {
//       setTimeout(() => {
//         console.log('Attempting to reconnect to CoinAPI...');
//         connectToCoinAPI(channels);
//       }, 5000);
//     }
//   };
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     if (body.channels) {
//       const { channels } = body;

//       if (!Array.isArray(channels) || channels.length === 0) {
//         return new Response('Invalid channels specified', { status: 400 });
//       }

//       activeChannels = channels;
//       connectToCoinAPI(channels);

//       return new Response('Connecting to CoinAPI', { status: 200 });
//     }

//     return new Response('Invalid request', { status: 400 });
//   } catch (error) {
//     console.error('Error in CoinAPI route:', error);
//     isConnecting = false;
//     return new Response('Internal Server Error', { status: 500 });
//   }
// }
