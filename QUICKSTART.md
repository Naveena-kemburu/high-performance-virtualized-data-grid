# Quick Start Guide

Get the application running in 3 simple steps:

## Step 1: Generate Data (Required)

```bash
npm install
npm run generate-data
```

This creates `public/transactions.json` with 1,000,000 records (~150MB).
Takes about 10-15 seconds.

## Step 2: Start Application

```bash
docker-compose up -d
```

Wait 30-60 seconds for the build and healthcheck to complete.

## Step 3: Open Browser

```
http://localhost:8080
```

You should see:
- A data grid with 1M transaction rows
- A green debug panel showing FPS, rendered rows, and scroll position
- Smooth 60 FPS scrolling

## Verify It Works

1. **Scroll the grid** - Should be smooth, FPS stays 55-60
2. **Check rendered rows** - Debug panel shows ~50-70 (not 1M!)
3. **Click "Amount" header** - Sorts all 1M rows
4. **Type in merchant filter** - Searches all 1M rows
5. **Click "Completed" button** - Filters by status
6. **Click a row** - Highlights it
7. **Double-click a cell** - Edits the value

## Stop Application

```bash
docker-compose down
```

## Troubleshooting

**Port 8080 already in use?**
Edit `docker-compose.yml` and change `"8080:80"` to `"8081:80"` (or any free port)

**Application not loading?**
Check logs: `docker-compose logs -f frontend`

**"Failed to load data" error?**
Make sure you ran `npm run generate-data` first!

## What's Next?

- Read `README.md` for detailed documentation
- Check `REQUIREMENTS_CHECKLIST.md` to see all implemented features
- Review `src/components/VirtualGrid.jsx` to understand the virtualization logic
