# Crypto3 - Crypto Trading Signal Management Platform

A Next.js 13 application for managing crypto trading signals and user subscriptions with Telegram integration.

## Features

### Admin Dashboard

- Real-time analytics for revenue, users, and signals
- Performance metrics and trend analysis
- Interactive data visualization

### Signal Management

- Create and manage trading signals
- Track signal performance and success rates
- Automated target monitoring
- Historical data analysis

### User Management

- User subscription management
- Role-based access control (Admin/User)
- Subscription plan management
- User activity tracking

### Telegram Integration

- Automated signal broadcasting
- User linking system via phone number verification
- Real-time notifications
- Analytics for Telegram users
  - Total linked users tracking
  - Active users monitoring
  - Link ratio analysis
  - User engagement metrics

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js
- **State Management**: React Query
- **API Integration**: Telegram Bot API (Webhook Mode)
- **Analytics**: Custom analytics system
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+
- PostgreSQL
- Telegram Bot Token
- Binance API credentials (for price tracking)

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crypto3"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Telegram
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_WEBHOOK_URL="your-webhook-url"

# Binance
BINANCE_API_KEY="your-api-key"
BINANCE_API_SECRET="your-api-secret"

# Subscription Prices (in MAD)
NEXT_PUBLIC_ONE_MONTH="price"
NEXT_PUBLIC_THREE_MONTHS="price"
NEXT_PUBLIC_SIX_MONTHS="price"
NEXT_PUBLIC_ONE_YEAR="price"
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/crypto3.git
cd crypto3
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up the database:

```bash
pnpm prisma generate
pnpm prisma db push
```

4. Set up the Telegram webhook:

```bash
# For development (using ngrok)
pnpm ngrok http 3000
pnpm setup-webhook https://your-ngrok-url.ngrok.io

# For production
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-vercel-domain.com/api/telegram/webhook"
```

5. Start the development server:

```bash
pnpm dev
```

## Project Structure

```
├── app/
│   ├── (protected)/          # Protected routes (requires authentication)
│   │   ├── admin/           # Admin dashboard and management
│   │   └── user/            # User dashboard
│   ├── (public)/            # Public routes
│   └── api/                 # API routes
├── components/              # Reusable components
├── lib/                     # Utility functions and services
├── prisma/                 # Database schema and migrations
└── types/                  # TypeScript type definitions
```

## API Routes

### Telegram Endpoints

- `POST /api/telegram/broadcast`: Send broadcast messages to subscribers

  - Requires admin authentication
  - Body: `{ message: string }`
  - Returns: `{ successful: number, failed: number }`

- `POST /api/telegram/webhook`: Receive updates from Telegram
  - Called by Telegram servers
  - IP-restricted to Telegram's IP ranges
  - Handles bot commands and interactions

### Telegram Bot Commands

The bot supports the following commands:

- `/start` - Start the bot and verify phone number
- `/link <email>` - Link account using email
- `/status` - Check account status
- `/logout` - Unlink account

## Development

### Running Tests

```bash
pnpm test
```

### Linting

```bash
pnpm lint
```

### Building for Production

```bash
pnpm build
```

## Deployment

1. Set up environment variables in your deployment platform
2. Deploy to Vercel:

```bash
vercel deploy
```

3. Set up the Telegram webhook:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-vercel-domain.com/api/telegram/webhook"
```

4. Verify webhook status:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

5. Verify bot access

```bash
NODE_ENV=production TELEGRAM_BOT_TOKEN=7664325897:AAEOD2V5jpmGyKEThuaLbpW4XeHGc61BjKI TELEGRAM_SECRET_TOKEN=p6n7dfagu6 npx ts-node scripts/setup-telegram-webhook.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
