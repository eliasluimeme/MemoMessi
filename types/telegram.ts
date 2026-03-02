export interface TelegramBroadcastResult {
  total: number;
  successful: number;
  failed: number;
}

export interface TelegramBroadcastOptions {
  plan?: 'ONE_MONTH' | 'THREE_MONTHS' | 'SIX_MONTHS' | 'ONE_YEAR';
  inline_keyboard?: any[][];
}

export interface TelegramLinkResult {
  success: boolean;
  message: string;
  userId?: string;
} 