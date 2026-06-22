# GenSexa Telegram Mini App MVP

Premium Telegram Mini App for a pelvic-floor-first women's wellness product.

## Current Product

- Telegram bot sends one message with one button: `Открыть приложение`.
- React/Vite Mini App contains:
  - onboarding
  - Today dashboard
  - pelvic floor practices
  - lesson library
  - cycle/body tracker
  - course purchase section
- Visual style uses the provided dark plum / gold ribbon reference.

## Local Run

```bash
npm install
npm run dev -- --port 5173
python3 bot/gensexa_bot.py
```

The bot reads local secrets from `.env.local`.

Required variables:

```bash
GENSEXA_BOT_TOKEN=...
GENSEXA_WEB_APP_URL=https://your-public-https-url
```

Telegram Mini App buttons need a public `https://` URL. For quick testing, a reverse tunnel can point to local Vite:

```bash
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -R 80:localhost:5173 nokey@localhost.run
```

Then set the generated `https://...lhr.life` URL as `GENSEXA_WEB_APP_URL` in `.env.local` and restart the bot.

## Production Build

```bash
npm run build
```

Deploy `dist/` to any static host with HTTPS. Then run `bot/gensexa_bot.py` as a worker process with the production Mini App URL.

## Safety Note

Do not commit `.env.local`, bot tokens, Telegram sessions, or other credentials.

