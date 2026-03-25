# Mobility Training Agent

This agent updates mobility workouts every 3 days with new exercises and routines for surfers.

## How It Works

1. **Every 3 days**: GitHub Actions runs this workflow
2. **Select workout**: Chooses from a rotating list of exercises
3. **Update**: Updates the mobility section with new content

## Manual Trigger

```bash
gh workflow run mobility-agent.yml
```

## Note

- Workouts are curated for surfers
- Focus on prevention of common surf injuries
- Updates every 3 days to keep content fresh