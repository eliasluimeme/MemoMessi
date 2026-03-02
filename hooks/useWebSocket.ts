// import { useEffect, useCallback, useRef, useState } from 'react';
// import { Socket } from 'socket.io-client';

// interface Message {
//   type: 'price' | 'alert' | 'notification';
//   content: string;
//   timestamp: number;
// }

// interface OHLC {
//   timestamp: number;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume: number;
// }

// interface UseWebSocketOptions {
//   onPriceUpdate?: (data: Message) => void;
//   onError?: (error: Error) => void;
//   onOHLCUpdate?: (data: OHLC) => void;
//   onCurrentCandleUpdate?: (data: OHLC) => void;
// }


// export function useWebSocket({ onPriceUpdate, onError, onOHLCUpdate, onCurrentCandleUpdate }: UseWebSocketOptions = {}) {
//   const socketRef = useRef<typeof Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   const sendMessage = useCallback((message: Message) => {
//     if (socketRef.current?.connected) {
//       socketRef.current.emit('crypto-price-update', message);
//     }
//   }, []);

//   useEffect(() => {
//     // Initialize WebSocket connection
//     const initWebSocket = async () => {
//       try {
//         // First, initialize the WebSocket server
//         const response = await fetch('/api/ws');
//         if (!response.ok) {
//           throw new Error('Failed to initialize WebSocket server');
//         }

//         // Then connect to it using the current origin
//         const wsUrl = window.location.origin;
//         socketRef.current = io(wsUrl, {
//           reconnectionAttempts: 5,
//           reconnectionDelay: 1000,
//           transports: ['websocket'],
//           timeout: 20000,
//           path: '/api/ws/socket.io',
//           // addTrailingSlash: false,
//           autoConnect: true,
//           reconnection: true,
//           forceNew: false,
//           // withCredentials: false
//         });

//         const socket = socketRef.current;

//         socket.on('connect', () => {
//           console.log('Connected to WebSocket server with ID:', socket.id);
//           setIsConnected(true);
//         });

//         socket.on('connection-status', (status: { connected: boolean }) => {
//           console.log('Connection status:', status);
//           setIsConnected(status.connected);
//         });

//         socket.on('connect_error', (error: Error) => {
//           console.error('Connection error:', error.message, error);
//           setIsConnected(false);
//           onError?.(error);
//         });

//         socket.on('price-update', (data: Message) => {
//           console.log('Received price update:', data);
//           onPriceUpdate?.(data);
//         });

//         socket.on('ohlc-update', (data: OHLC) => {
//           console.log('Received OHLC update:', data);
//           onOHLCUpdate?.(data);
//         });

//         socket.on('current-candle-update', (data: OHLC) => {
//           console.log('Received current candle update:', data);
//           onCurrentCandleUpdate?.(data);
//         });

//         socket.on('error', (error: Error) => {
//           console.error('WebSocket error:', error);
//           onError?.(error);
//         });

//         socket.on('disconnect', (reason: string) => {
//           console.log('WebSocket disconnected:', reason);
//           setIsConnected(false);
          
//           // Attempt to reconnect unless the disconnection was intentional
//           if (reason !== 'io client disconnect') {
//             socket.connect();
//           }
//         });

//         // Ensure we're connected
//         if (!socket.connected) {
//           socket.connect();
//         }
//       } catch (error) {
//         console.error('Failed to initialize WebSocket:', error);
//         setIsConnected(false);
//         onError?.(error instanceof Error ? error : new Error('Failed to initialize WebSocket'));
//       }
//     };

//     initWebSocket();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//         setIsConnected(false);
//       }
//     };
//   }, [onPriceUpdate, onError, onOHLCUpdate, onCurrentCandleUpdate]);

//   return {
//     sendMessage,
//     isConnected,
//   };
// } 
