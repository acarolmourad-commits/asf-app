# Mental Wellness Agent

This agent sends daily tips to combat fear and anxiety, focusing on surfers' mental health.

## How It Works

1. **Daily Run**: GitHub Actions runs this workflow every day
2. **Tip Selection**: Rotates through a curated list of mental wellness tips
3. **Delivery**: Can post to app, send via Telegram, or store for later

## Content Categories

- 🧠 Mindfulness & Breathing
- 🌊 Surf-specific mental tips
- 💪 Confidence building
- 😰 Anxiety management
- 🧘 Meditation exercises
- 🌅 Morning motivation

## Manual Trigger

```bash
gh workflow run mental-wellness.yml
```

## Note

- This is an internal agent (no external messages without approval)
- Tips are stored in the app for users to access
- Can be extended to push notifications later