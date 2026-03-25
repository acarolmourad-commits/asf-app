# Daily Store Finder Agent

This agent runs daily to find real surf shops from the São Paulo coast with active Instagram accounts and update the stores list.

## How it works

1. **Daily Run**: GitHub Actions runs this workflow every day at 6 AM (BRT)
2. **Search**: Uses web search to find new surf shops on São Paulo coast
3. **Verify**: Checks if the store has an active Instagram account
4. **Update**: Adds new stores to the list and pushes changes

## Store Data Required

For each store, we need:
- Store name
- City/Region (Bertioga, Santos, Guarujá, Ubatuba, etc.)
- Instagram username
- Description/specialty
- Follower count (if available)

## Search Queries

The agent uses these search patterns:
- "loja de surf [city] instagram"
- "surf shop [city] São Paulo"
- "loja surf Litoral Paulista"
- "surfshop Ubatuba Santos Guarujá"

## Manual Trigger

You can also trigger manually:
```bash
gh workflow run store-finder.yml
```

## Notes

- The agent uses Brave Search API to find stores
- Only adds stores with verified Instagram accounts
- Avoids duplicates by checking existing store names
- Updates follower counts for existing stores