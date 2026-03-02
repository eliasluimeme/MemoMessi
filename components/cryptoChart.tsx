// 'use client';

// import { useEffect, useState } from 'react';

// import { useWebSocket } from '@/hooks/useWebSocket';
// import { toast } from 'react-hot-toast';
// import {
//   CartesianGrid,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from 'recharts';

// interface OHLC {
//   timestamp: number;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume: number;
// }

// interface Message {
//   type: 'price' | 'alert' | 'notification';
//   content: string;
//   timestamp: number;
// }

// const CryptoChart = () => {
//   const [candleData, setCandleData] = useState<OHLC[]>([]);
//   const [currentCandle, setCurrentCandle] = useState<OHLC | null>(null);
//   const [lastUpdate, setLastUpdate] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Subscribe to CoinAPI on component mount
//   useEffect(() => {
//     async function subscribeToCoinAPI() {
//       try {
//         console.log('Initiating CoinAPI subscription...');
//         const response = await fetch('/api/coinAPI', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             channels: ['BITSTAMP_SPOT_BTC_USD'],
//           }),
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to subscribe: ${errorText}`);
//         }
//         console.log('Successfully subscribed to CoinAPI');
//       } catch (error) {
//         console.error('Subscription error:', error);
//         setError(error instanceof Error ? error.message : 'Failed to subscribe to CoinAPI');
//         toast.error('Failed to subscribe to CoinAPI');
//       }
//     }

//     subscribeToCoinAPI();
//   }, []);

//   const { isConnected } = useWebSocket({
//     onPriceUpdate: (message: Message) => {
//       console.log('Chart received price update:', message);
//       try {
//         if (message.type === 'price') {
//           setLastUpdate(new Date().toLocaleString());
//         }
//       } catch (error) {
//         console.error('Error processing message:', error);
//         setError('Error processing trade data');
//         toast.error('Error processing trade data');
//       }
//     },
//     onError: (error) => {
//       console.error('WebSocket error in chart:', error);
//       setError(error.message);
//       toast.error(`WebSocket error: ${error.message}`);
//     },
//     onOHLCUpdate: (candle: OHLC) => {
//       console.log('Chart received OHLC update:', candle);
//       setCandleData((prev) => {
//         const newData = [...prev.slice(-99), candle];
//         console.log('Updated candle data:', newData);
//         return newData;
//       });
//       setLastUpdate(new Date(candle.timestamp).toLocaleString());
//     },
//     onCurrentCandleUpdate: (candle: OHLC) => {
//       console.log('Chart received current candle update:', candle);
//       setCurrentCandle(candle);
//       setLastUpdate(new Date(candle.timestamp).toLocaleString());
//     },
//   });

//   // Combine historical and current candle data for display
//   const displayData = currentCandle ? [...candleData.slice(-99), currentCandle] : candleData;

//   console.log('Chart render - Display data:', displayData);
//   console.log('Chart render - Current candle:', currentCandle);
//   console.log('Chart render - Connection status:', isConnected);

//   return (
//     <div className="relative space-y-4 rounded-lg border p-4">
//       <div className="flex items-center justify-between">
//         <div className="space-y-1">
//           <div className="text-sm font-medium">Bitcoin Price (USD)</div>
//           <div className="text-sm text-muted-foreground">
//             Status: {isConnected ? 'Connected' : 'Connecting...'}
//           </div>
//         </div>
//         {lastUpdate && (
//           <div className="text-sm text-muted-foreground">Last Update: {lastUpdate}</div>
//         )}
//       </div>

//       {error && <div className="text-sm text-red-500">Error: {error}</div>}

//       <div className="relative h-[400px]">
//         {!isConnected && (
//           <div className="absolute inset-0 flex items-center justify-center bg-background/50">
//             <p className="text-muted-foreground">Connecting to WebSocket server...</p>
//           </div>
//         )}

//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={displayData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="timestamp"
//               tick={{ fontSize: 12 }}
//               tickFormatter={(value) => new Date(value).toLocaleTimeString()}
//             />
//             <YAxis
//               tick={{ fontSize: 12 }}
//               domain={['auto', 'auto']}
//               width={80}
//               tickFormatter={(value) => `$${value.toLocaleString()}`}
//             />
//             <Tooltip
//               formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
//               labelFormatter={(label) => new Date(label).toLocaleString()}
//             />
//             <Line
//               type="monotone"
//               dataKey="close"
//               stroke="#8884d8"
//               name="Price"
//               dot={false}
//               isAnimationActive={false}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="space-y-2 text-sm">
//         <div className="flex items-center justify-between text-muted-foreground">
//           <div>Candles: {displayData.length}</div>
//           {currentCandle && (
//             <div className="space-x-4">
//               <span>O: ${currentCandle.open.toLocaleString()}</span>
//               <span>H: ${currentCandle.high.toLocaleString()}</span>
//               <span>L: ${currentCandle.low.toLocaleString()}</span>
//               <span>C: ${currentCandle.close.toLocaleString()}</span>
//               <span>V: {currentCandle.volume}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CryptoChart;
