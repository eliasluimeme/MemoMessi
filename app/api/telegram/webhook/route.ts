import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { telegramService } from '@/lib/telegram';

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] 🚀 Webhook request received`);
  
  try {
    const headersList = await headers();
    const secretToken = headersList.get('x-telegram-bot-api-secret-token');
    
    // Log headers in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${requestId}] Headers:`, Object.fromEntries(headersList.entries()));
    }
    
    // Verify secret token in production
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.TELEGRAM_SECRET_TOKEN) {
        console.error(`[${requestId}] ❌ TELEGRAM_SECRET_TOKEN not set in environment`);
        return new NextResponse('Configuration Error', { status: 500 });
      }

      if (!secretToken) {
        console.error(`[${requestId}] ❌ No secret token in request headers`);
        return new NextResponse('Unauthorized', { status: 401 });
      }

      if (secretToken !== process.env.TELEGRAM_SECRET_TOKEN) {
        console.error(`[${requestId}] ❌ Invalid secret token`);
        return new NextResponse('Unauthorized', { status: 401 });
      }
      
      console.log(`[${requestId}] ✅ Secret token verified`);
    }

    // Parse and validate request body
    let update;
    try {
      update = await req.json();
    } catch (error) {
      console.error(`[${requestId}] ❌ Failed to parse request body:`, error);
      return new NextResponse('Invalid JSON', { status: 400 });
    }

    // Log update in development or if it's an error
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${requestId}] 📦 Update payload:`, JSON.stringify(update, null, 2));
    }

    // Extract and log useful info
    const chatId = update.message?.chat?.id;
    const username = update.message?.from?.username;
    const command = update.message?.text;
    const callbackData = update.callback_query?.data;
    
    console.log(`[${requestId}] 📨 Processing update from ${username || chatId}: ${command || callbackData || 'No text'}`);

    // Process update with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Update processing timeout')), 8000);
    });

    await Promise.race([
      telegramService.handleUpdate(update),
      timeoutPromise
    ]);

    console.log(`[${requestId}] ✅ Update processed successfully`);
    
    return new NextResponse('OK', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
  } catch (error) {
    console.error(`[${requestId}] ❌ Error processing webhook:`, error);
    // Always return 200 to prevent Telegram from retrying
    return new NextResponse('OK', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse('OK', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Telegram-Bot-Api-Secret-Token',
    },
  });
} 