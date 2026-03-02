#!/usr/bin/env ts-node

const token = process.env.TELEGRAM_BOT_TOKEN;
const DEV_URL = 'https://crypto-mng-git-dev-elis-projects-1a8af7d2.vercel.app';
const PROD_URL = 'https://www.cryptomng.com';

// Generate a random secret token if not provided
const secretToken = process.env.TELEGRAM_SECRET_TOKEN || Math.random().toString(36).substring(2);

// Default to PROD_URL, can be overridden by command line argument
const url = process.argv[2] || PROD_URL;

// Log environment
console.log('🌍 Environment:', process.env.NODE_ENV || 'production');

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN environment variable is not set');
  process.exit(1);
}

async function makeRequest(url: string, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

async function setupWebhook() {
  console.log('🔄 Setting up Telegram webhook...');
  console.log(`🌍 Using URL: ${url}`);
  
  try {
    // First, delete any existing webhook
    const deleteUrl = `https://api.telegram.org/bot${token}/deleteWebhook`;
    await makeRequest(deleteUrl);
    console.log('✅ Deleted existing webhook');

    // Clear pending updates
    const clearUpdatesUrl = `https://api.telegram.org/bot${token}/getUpdates?offset=-1`;
    await makeRequest(clearUpdatesUrl);
    console.log('✅ Cleared pending updates');

    // Set up the new webhook with secret token
    const webhookUrl = `${url}/api/telegram/webhook`;
    const formData = new FormData();
    formData.append('url', webhookUrl);
    formData.append('secret_token', secretToken);
    formData.append('allowed_updates', JSON.stringify(['message', 'callback_query']));
    formData.append('max_connections', '100');
    formData.append('drop_pending_updates', 'true');

    const setUrl = `https://api.telegram.org/bot${token}/setWebhook`;
    const result = await makeRequest(setUrl, {
      method: 'POST',
      body: formData
    });

    if (result.ok) {
      console.log('✅ Webhook set up successfully!');
      console.log(`🎯 Webhook URL: ${webhookUrl}`);
      console.log(`🔑 Secret Token: ${secretToken}`);
      console.log('\n⚠️  Important: Set these environment variables in your deployment:');
      console.log(`TELEGRAM_SECRET_TOKEN=${secretToken}`);
      console.log(`TELEGRAM_BOT_TOKEN=${token}`);
    } else {
      throw new Error(result.description || 'Failed to set webhook');
    }

    // Get webhook info
    const infoUrl = `https://api.telegram.org/bot${token}/getWebhookInfo`;
    const info = await makeRequest(infoUrl);
    
    console.log('\n📊 Webhook Info:');
    console.log(JSON.stringify(info.result, null, 2));

    // Get bot info to verify token
    console.log('\n🔍 Verifying bot access...');
    const meInfo = await makeRequest(`https://api.telegram.org/bot${token}/getMe`);
    if (meInfo.ok) {
      console.log(`✅ Bot verified: @${meInfo.result.username}`);
    }
  } catch (error) {
    console.error('❌ Error setting up webhook:', error);
    process.exit(1);
  }
}

setupWebhook().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 