// import { useCallback, useEffect, useRef, useState } from 'react';

// import ReconnectingWebSocket from 'reconnecting-websocket';

// import { getExchangePair } from '@/lib/utils/market-utils';

// export interface MarketData {
//   price: number;
//   timestamp: string;
//   volume?: number;
//   high?: number;
//   low?: number;
//   open?: number;
//   close?: number;
// }

// export interface CryptoTickerData {
//   symbol_id: string;
//   currentPrice: number;
//   lastUpdate: string;
//   volume24h?: number;
//   historicalData: MarketData[];
//   connectionStatus: 'connecting' | 'connected' | 'disconnected';
//   exchange: string;
// }

// interface SubscriptionOptions {
//   symbol_id: string;
//   interval?: '1MIN' | '5MIN' | '15MIN' | '30MIN' | '1HOR' | '1DAY';
// }

// export function useCoinAPIData(
//   baseAsset: string,
//   market: string,
//   quoteAsset = 'USD',
//   apiKey: string,
//   interval: SubscriptionOptions['interval'] = '1MIN',
// ): CryptoTickerData {
//   const [data, setData] = useState<CryptoTickerData>({
//     symbol_id: '',
//     currentPrice: 0,
//     lastUpdate: '',
//     historicalData: [],
//     connectionStatus: 'connecting',
//     exchange: market,
//   });

//   const socketRef = useRef<ReconnectingWebSocket | null>(null);
//   const reconnectAttemptsRef = useRef<number>(0);
//   const MAX_RECONNECT_ATTEMPTS = 3;

//   const handleMessage = useCallback((message: any) => {
//     try {
//       switch (message.type) {
//         case 'quote':
//           setData((prev) => ({
//             ...prev,
//             currentPrice: message.ask_price,
//             lastUpdate: message.time,
//           }));
//           break;
//         case 'ohlcv':
//           const newCandle: MarketData = {
//             price: message.price_close,
//             timestamp: message.time_period_end,
//             volume: message.volume_traded,
//             high: message.price_high,
//             low: message.price_low,
//             open: message.price_open,
//             close: message.price_close,
//           };

//           setData((prev) => ({
//             ...prev,
//             historicalData: [...prev.historicalData, newCandle].slice(-100), // Keep last 100 candles
//           }));
//           break;
//       }
//     } catch (error) {
//       console.error('Error handling message:', error);
//     }
//   }, []);

//   const connect = useCallback(() => {
//     const { exchange: selectedExchange, symbolId } = getExchangePair(market, baseAsset, quoteAsset);

//     try {
//       socketRef.current = new ReconnectingWebSocket('wss://ws.coinapi.io/v4/');

//       socketRef.current.onopen = () => {
//         if (socketRef.current?.readyState === WebSocket.OPEN) {
//           // Initial hello message
//           socketRef.current.send(
//             JSON.stringify({
//               type: 'hello',
//               apikey: apiKey,
//               subscribe_data_type: ['quote', 'ohlcv'],
//               subscribe_filter_symbol_id: [symbolId],
//               subscribe_filter_period_id: [interval],
//             }),
//           );

//           setData((prev) => ({
//             ...prev,
//             symbol_id: symbolId,
//             exchange: selectedExchange,
//             connectionStatus: 'connected',
//           }));

//           reconnectAttemptsRef.current = 0;
//         }
//       };

//       socketRef.current.onmessage = (event) => {
//         const message = JSON.parse(event.data);
//         handleMessage(message);
//       };

//       socketRef.current.onclose = (event) => {
//         setData((prev) => ({ ...prev, connectionStatus: 'disconnected' }));

//         if (!event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
//           reconnectAttemptsRef.current += 1;
//           setTimeout(connect, 5000);
//         }
//       };

//       socketRef.current.onerror = () => {
//         setData((prev) => ({ ...prev, connectionStatus: 'disconnected' }));
//       };
//     } catch (error) {
//       console.error('WebSocket connection error:', error);
//       setData((prev) => ({ ...prev, connectionStatus: 'disconnected' }));
//     }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, [apiKey, market, baseAsset, quoteAsset, interval, handleMessage]);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const cleanup = connect();
//       return cleanup;
//     }
//   }, [connect]);

//   return data;
// }
