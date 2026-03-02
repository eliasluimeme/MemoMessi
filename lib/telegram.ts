import TelegramBot from 'node-telegram-bot-api';
import { prisma } from '@/lib/prisma';
import { TelegramBroadcastResult, TelegramBroadcastOptions } from '@/types/telegram';
import { $Enums } from '@prisma/client';
const SubscriptionStatus = $Enums.SubscriptionStatus;

interface TelegramUpdate {
  message?: {
    text?: string;
    chat: {
      id: number;
    };
    from?: {
      id: number;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
    contact?: {
      phone_number: string;
      first_name: string;
      user_id: number;
    };
  };
  callback_query?: {
    data?: string;
    message?: {
      chat: {
        id: number;
      };
      message_id: number;
    };
  };
}

class TelegramService {
  private static instance: TelegramService;
  private bot: TelegramBot;

  private constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');

    // In serverless, we don't want to use webhooks or polling
    this.bot = new TelegramBot(token, { webHook: false });
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  async handleUpdate(update: TelegramUpdate) {
    console.log('Handling update:', JSON.stringify(update, null, 2));

    // Handle callback queries (button clicks)
    if (update.callback_query?.data && update.callback_query.message) {
      const chatId = update.callback_query.message.chat.id;
      const messageId = update.callback_query.message.message_id;
      const data = update.callback_query.data;

      if (data === 'confirm_unsub') {
        await this.handleLogoutConfirmation(chatId, messageId);
        return;
      } else if (data === 'cancel_unsub') {
        await this.bot.editMessageText('✅ Logout cancelled. You will continue receiving notifications.', {
          chat_id: chatId,
          message_id: messageId
        });
        return;
      }
    }

    if (!update.message?.chat) {
      console.log('No message or chat in update');
      return;
    }

    const text = update.message.text || '';
    const chatId = update.message.chat.id;

    console.log(`Processing message: "${text}" from chat ${chatId}`);

    try {
      // Handle phone number sharing
      if (update.message.contact) {
        await this.handlePhoneNumber(chatId, update.message.contact.phone_number);
        return;
      }

      if (text.startsWith('/start')) {
        await this.handleStartCommand(chatId);
      } else if (text.startsWith('/link')) {
        // Check for existing link first
        const existingLinked = await prisma.user.findUnique({
          where: { telegramChatId: chatId.toString() },
          include: { subscriptions: true }
        });

        if (existingLinked) {
          const subscriptionStatus = existingLinked.subscriptions?.status === SubscriptionStatus.ACTIVE
            ? '✅ Your subscription is active'
            : '❌ No active subscription found';

          await this.bot.sendMessage(chatId,
            `🔒 Account Already Linked\n\n` +
            `Email: ${existingLinked.email}\n` +
            `${subscriptionStatus}\n\n` +
            `To link a different account:\n` +
            `1. Use /logout to unlink current account\n` +
            `2. Then use /link or /start again`
          );
          return;
        }

        // If no existing link, proceed with email check
        const email = text.split(' ')[1];
        if (email) {
          await this.handleLinkCommand(chatId, email);
        } else {
          await this.bot.sendMessage(chatId, '❌ Please provide your email address: /link your@email.com');
        }
      } else if (text.startsWith('/status')) {
        await this.handleStatusCommand(chatId);
      } else if (text.startsWith('/logout')) {
        await this.handleUnsubscribeCommand(chatId);
      } else if (text.startsWith('/upgrade')) {
        await this.handleUpgradeCommand(chatId);
      } else {
        console.log('Unknown command:', text);
        await this.bot.sendMessage(chatId,
          'Available commands:\n' +
          '/start - Start the bot\n' +
          '/status - Check your account status\n' +
          '/upgrade - Upgrade your subscription\n' +
          '/logout - Stop receiving notifications'
        );
      }
    } catch (error) {
      console.error('Error handling command:', error);
      await this.bot.sendMessage(chatId, '❌ An error occurred while processing your command. Please try again later.');
    }
  }

  private async handleStartCommand(chatId: number) {
    console.log('Handling /start command for chat:', chatId);

    try {
      // Check if user is already linked
      const existingUser = await prisma.user.findUnique({
        where: { telegramChatId: chatId.toString() },
        include: { subscriptions: true }
      });

      if (existingUser) {
        const subscriptionStatus = existingUser.subscriptions?.status === SubscriptionStatus.ACTIVE
          ? '✅ Your subscription is active'
          : '❌ No active subscription found';

        await this.bot.sendMessage(chatId,
          `🔒 Account Already Linked\n\n` +
          `Email: ${existingUser.email}\n` +
          `${subscriptionStatus}\n\n`
        );
        return;
      }

      // Check if user exists by phone number but not linked
      const user = await prisma.user.findFirst({
        where: { telegramChatId: null },
        include: { subscriptions: true }
      });

      if (user && user.role !== 'ADMIN' && (!user.subscriptions || user.subscriptions.status !== SubscriptionStatus.ACTIVE)) {
        await this.bot.sendMessage(chatId,
          '❌ No active subscription found!\n\n' +
          'Please subscribe to access our services:\n' +
          'https://www.cryptomng.com/');
        return;
      }

      // Request phone number using a custom keyboard
      await this.bot.sendMessage(chatId,
        'Welcome to CryptoMng! 🚀\n\nTo get started, please share your phone number so we can verify your account.', {
        reply_markup: {
          keyboard: [[{
            text: '📱 Share Phone Number',
            request_contact: true
          }]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    } catch (error) {
      console.error('Error in handleStartCommand:', error);
      await this.bot.sendMessage(chatId, '❌ An error occurred. Please try again later.');
    }
  }

  private normalizePhoneNumber(phone: string): string {
    // Remove all non-digit characters except plus sign
    let normalized = phone.replace(/[^\d+]/g, '');

    // Remove leading zeros after plus
    normalized = normalized.replace(/\+0+/, '+');

    // If number doesn't start with +, check for known country codes
    if (!normalized.startsWith('+')) {
      const countryPrefixes = {
        '1': ['US', 'CA'],          // USA, Canada
        '44': ['GB'],               // UK
        '33': ['FR'],               // France
        '49': ['DE'],               // Germany
        '212': ['MA'],              // Morocco
        '91': ['IN'],               // India
        '86': ['CN'],               // China
        '7': ['RU'],                // Russia
        '81': ['JP'],               // Japan
        '82': ['KR'],               // South Korea
        '971': ['AE'],              // UAE
        '966': ['SA'],              // Saudi Arabia
        '20': ['EG'],               // Egypt
        '27': ['ZA'],               // South Africa
        '234': ['NG'],              // Nigeria
        '254': ['KE'],              // Kenya
        '255': ['TZ'],              // Tanzania
        '256': ['UG'],              // Uganda
        '251': ['ET'],              // Ethiopia
        '250': ['RW'],              // Rwanda
      };

      // Check if the number starts with any country code
      for (const prefix of Object.keys(countryPrefixes)) {
        if (normalized.startsWith(prefix)) {
          normalized = '+' + normalized;
          break;
        }
      }

      // If still no plus and starts with a country code length number
      if (!normalized.startsWith('+')) {
        // Check for common lengths of international numbers
        if (normalized.length === 11 || normalized.length === 12) {
          normalized = '+' + normalized;
        }
      }
    }

    // If still no plus, assume it needs the last known country code
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }

    return normalized;
  }

  private async handlePhoneNumber(chatId: number, phoneNumber: string) {
    console.log('Handling phone number for chat:', chatId, 'phone:', phoneNumber);

    try {
      // Normalize the phone number
      const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
      console.log('Normalized phone:', normalizedPhone);

      // Try different formats to find the user
      const possibleFormats = [
        normalizedPhone,
        normalizedPhone.replace(/^\+/, ''),  // Without plus
        phoneNumber.replace(/[-()\s]/g, ''),  // Original with only special chars removed
      ];

      let user = null;
      for (const format of possibleFormats) {
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { phoneNumber: format },
              { phoneNumber: format.replace(/^\+/, '') }  // Try without + prefix
            ]
          },
          include: { subscriptions: true }
        });
        if (user) break;
      }

      if (!user) {
        await this.bot.sendMessage(chatId,
          '❌ No account found with this phone number. Please sign up on our website first.\n\n' +
          `Provided number: ${phoneNumber}\n` +
          `Normalized format: ${normalizedPhone}`, {
          reply_markup: { remove_keyboard: true }
        });
        return;
      }

      // Update user with Telegram chat ID
      await prisma.user.update({
        where: { id: user.id },
        data: { telegramChatId: chatId.toString() }
      });

      // Send success message based on subscription status
      const message = user.subscriptions?.status === SubscriptionStatus.ACTIVE
        ? '✅ Account verified successfully! You will now receive signal notifications.'
        : '✅ Account verified, but no active subscription found. Please subscribe to receive notifications.';

      await this.bot.sendMessage(chatId, message, {
        reply_markup: { remove_keyboard: true }
      });
    } catch (error) {
      console.error('Error handling phone number:', error);
      await this.bot.sendMessage(chatId, '❌ Error verifying your account. Please try again later.', {
        reply_markup: { remove_keyboard: true }
      });
    }
  }

  private async handleLinkCommand(chatId: number, email: string) {
    console.log('Handling /link command for chat:', chatId, 'email:', email);
    try {
      // First check if this chat already has a linked account
      const existingLinked = await prisma.user.findUnique({
        where: { telegramChatId: chatId.toString() },
        include: { subscriptions: true }
      });

      if (existingLinked) {
        const subscriptionStatus = existingLinked.subscriptions?.status === SubscriptionStatus.ACTIVE
          ? '✅ Your subscription is active'
          : '❌ No active subscription found';

        await this.bot.sendMessage(chatId,
          `🔒 Account Already Linked\n\n` +
          `Email: ${existingLinked.email}\n` +
          `${subscriptionStatus}\n\n` +
          `To link a different account:\n` +
          `1. Use /logout to unlink current account\n` +
          `2. Then use /link or /start again`
        );
        return;
      }

      // If no existing link, proceed with linking new account
      const user = await prisma.user.findUnique({
        where: { email },
        include: { subscriptions: true }
      });

      if (!user) {
        await this.bot.sendMessage(chatId, '❌ User not found. Please check your email.');
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { telegramChatId: chatId.toString() }
      });

      const message = user.subscriptions?.status === SubscriptionStatus.ACTIVE
        ? '✅ Account linked successfully! You will now receive signal notifications.'
        : '✅ Account linked, but no active subscription found. Please subscribe to receive notifications.';

      await this.bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error linking account:', error);
      await this.bot.sendMessage(chatId, '❌ Error linking account. Please try again later.');
    }
  }

  private async handleStatusCommand(chatId: number) {
    console.log('Handling /status command for chat:', chatId);
    try {
      const user = await prisma.user.findUnique({
        where: { telegramChatId: chatId.toString() },
        include: { subscriptions: true }
      });

      if (!user) {
        await this.bot.sendMessage(chatId, '❌ No account linked to this chat.');
        return;
      }

      const isActive = user.subscriptions?.status === SubscriptionStatus.ACTIVE;
      const statusEmoji = isActive ? '✅' : '❌';
      const expiryDate = user.subscriptions?.expiresAt
        ? user.subscriptions.expiresAt.toLocaleDateString()
        : 'No active subscription';

      await this.bot.sendMessage(chatId,
        `🔒 Account Information:\n\n` +
        `👤 Name: ${user.fullName}\n` +
        `📊 Subscription Details:\n` +
        `${statusEmoji} Status: ${user.subscriptions?.status || 'NONE'}\n` +
        `⏰ Expires: ${expiryDate}\n\n` +
        `${!isActive ? '⚠️ Your subscription is not active. Upgrade now to receive signals!' : ''}`, {
        reply_markup: {
          inline_keyboard: [[
            { text: '🚀 Upgrade Subscription', url: 'https://www.cryptomng.com/upgrade' }
          ]]
        }
      });
    } catch (error) {
      console.error('Error checking status:', error);
      await this.bot.sendMessage(chatId, '❌ Error checking status. Please try again later.');
    }
  }

  private async handleLogoutConfirmation(chatId: number, messageId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { telegramChatId: chatId.toString() },
        include: { subscriptions: true }
      });

      if (!user) {
        await this.bot.editMessageText('❌ No account linked to this chat.', {
          chat_id: chatId,
          message_id: messageId
        });
        return;
      }

      const userEmail = user.email;
      const userName = user.fullName;

      // Remove Telegram chat ID
      await prisma.user.update({
        where: { id: user.id },
        data: { telegramChatId: null }
      });

      // Update the confirmation message
      await this.bot.editMessageText('✅ You have been logged out successfully.', {
        chat_id: chatId,
        message_id: messageId
      });

      // Send final goodbye message
      await this.bot.sendMessage(chatId,
        `👋 Goodbye ${userName}!\n\n` +
        `Your account (${userEmail}) has been successfully logged out from CryptoMng.\n\n` +
        `To receive signals again:\n` +
        `1. Use /start command\n` +
        `2. Verify your phone number\n\n` +
        `Stay profitable! 📈`
      );
    } catch (error) {
      console.error('Error confirming logout:', error);
      await this.bot.editMessageText('❌ Error processing your logout request. Please try again later.', {
        chat_id: chatId,
        message_id: messageId
      });
    }
  }

  private async handleUnsubscribeCommand(chatId: number) {
    console.log('Handling /unsubscribe command for chat:', chatId);

    try {
      const user = await prisma.user.findUnique({
        where: { telegramChatId: chatId.toString() },
        include: { subscriptions: true }
      });

      if (!user) {
        await this.bot.sendMessage(chatId, '❌ No account linked. Use /start command to link your CryptoMng Whales account.');
        return;
      }

      await this.bot.sendMessage(chatId,
        '⚠️ Are you sure you want to logout?\n\n' +
        'You can always login again by using /start command.', {
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ Yes, logout', callback_data: 'confirm_unsub' },
            { text: '❌ No, keep loggedin', callback_data: 'cancel_unsub' }
          ]]
        }
      });
    } catch (error) {
      console.error('Error handling logout:', error);
      await this.bot.sendMessage(chatId, '❌ Error processing your logout request. Please try again later.');
    }
  }

  private async handleUpgradeCommand(chatId: number) {
    console.log('Handling /upgrade command for chat:', chatId);
    try {
      const user = await prisma.user.findUnique({
        where: { telegramChatId: chatId.toString() },
        include: { subscriptions: true }
      });

      if (!user) {
        await this.bot.sendMessage(chatId,
          '❌ No account linked to this chat.\n' +
          'Please use /start to link your account first.');
        return;
      }

      const subscriptionStatus = user.subscriptions?.status || 'NONE';
      const expiryDate = user.subscriptions?.expiresAt
        ? user.subscriptions.expiresAt.toLocaleDateString()
        : 'No active subscription';

      await this.bot.sendMessage(chatId,
        `📊 Current Subscription Status:\n\n` +
        `Status: ${subscriptionStatus}\n` +
        `Expires: ${expiryDate}\n\n` +
        `Click below to upgrade your subscription:`, {
        reply_markup: {
          inline_keyboard: [[
            { text: '🚀 Upgrade Subscription', url: 'https://www.cryptomng.com/upgrade' }
          ]]
        }
      });
    } catch (error) {
      console.error('Error handling upgrade command:', error);
      await this.bot.sendMessage(chatId, '❌ Error checking subscription status. Please try again later.');
    }
  }

  async sendToSubscribers(
    message: string,
    options?: TelegramBroadcastOptions
  ): Promise<TelegramBroadcastResult> {
    const subscribers = await prisma.user.findMany({
      where: {
        telegramChatId: { not: null },
        OR: [
          {
            role: 'ADMIN'
          },
          {
            subscriptions: {
              status: SubscriptionStatus.ACTIVE,
              ...(options?.plan ? { plan: options.plan } : {})
            }
          }
        ]
      },
      include: {
        subscriptions: true
      }
    });

    const results = await Promise.allSettled(
      subscribers.filter(sub => sub.telegramChatId).map(sub =>
        this.sendMessage(sub.telegramChatId!, message, options)
      )
    );

    return {
      total: subscribers.length,
      successful: results.filter((r: PromiseSettledResult<boolean>) => r.status === 'fulfilled').length,
      failed: results.filter((r: PromiseSettledResult<boolean>) => r.status === 'rejected').length
    };
  }

  async sendMessage(chatId: string, message: string, options?: TelegramBroadcastOptions): Promise<boolean> {
    try {
      await this.bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        reply_markup: options?.inline_keyboard ? {
          inline_keyboard: options.inline_keyboard
        } : undefined
      });
      return true;
    } catch (error) {
      console.error(`Failed to send message to ${chatId}:`, error);
      return false;
    }
  }
}

export const telegramService = TelegramService.getInstance(); 