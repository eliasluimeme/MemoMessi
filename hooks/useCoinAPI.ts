import { useCallback, useEffect, useRef, useState } from 'react';

import { getExchangePair } from '@/lib/utils/market-utils';

interface WebSocketHook {
  price: number | null;
  lastUpdate: string | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  exchange: string;
}

export function useCoinAPI(
  baseAsset: string,
  market: string,
  quoteAsset = 'USDT',
  apiKey: string,
): WebSocketHook {
  const [price, setPrice] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting');
  const [exchange, setExchange] = useState<string>(market);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  const connectWebSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const { exchange: selectedExchange, symbolId } = getExchangePair(market, baseAsset, quoteAsset);
    setExchange(selectedExchange);

    const socket = new WebSocket('wss://ws.coinapi.io/v4/');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log(`Connected to ${selectedExchange} websocket`);
      setConnectionStatus('connected');
      reconnectAttemptsRef.current = 0;

      const subscribeMessage = JSON.stringify({
        type: 'hello',
        apikey: apiKey,
        subscribe_data_type: ['quote'],
        subscribe_filter_symbol_id: [symbolId],
      });

      socket.send(subscribeMessage);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'quote' && data.symbol_id === symbolId) {
          setPrice(data.ask_price);
          setLastUpdate(new Date(data.time).toLocaleString());
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = (event) => {
      setConnectionStatus('disconnected');

      if (!event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttemptsRef.current += 1;
        setTimeout(connectWebSocket, 5000);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };

    return () => {
      socket.close();
    };
  }, [market, baseAsset, quoteAsset, apiKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cleanup = connectWebSocket();
      return cleanup;
    }
  }, [connectWebSocket]);

  return { price, lastUpdate, connectionStatus, exchange };
}
