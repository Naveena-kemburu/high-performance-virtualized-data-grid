# Setup Instructions

## Quick Start (Recommended)

Follow these steps to get the application running:

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Generate Test Data

This will create a file with 1,000,000 transaction records (~150MB):

```bash
npm run generate-data
```

Expected output:
```
Generating 1,000,000 transaction records...
Generated 100000 records...
Generated 200000 records...
...
Generated 1000000 records...
Writing to file...
Generation time: ~10-15 seconds
Successfully generated 1000000 records at public/transactions.json
File size: ~150 MB
```

### Step 3: Run with Docker

```bash
docker-compose up -d
```

Wait for the healthcheck to pass (about 30 seconds), then open:
```
http://localhost:8080
```

### Step 4: Verify Application

You should see:
- A data grid with transaction data
- A floating debug panel in the top-right corner showing:
  - FPS (should be 55-60)
  - Rendered Rows (should be 50-70)
  - Scroll Position (e.g., "0 / 1,000,000")

## Alternative: Local Development

If you want to run the dev server instead of Docker:

```bash
# After steps 1 and 2 above
npm run dev
```

Then open `http://localhost:3000`

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution**: Run `npm install` again

### Issue: Application shows "Failed to load data"
**Solution**: Make sure you ran `npm run generate-data` and the file `public/transactions.json` exists

### Issue: Docker healthcheck failing
**Solution**: 
- Check if port 8080 is already in use
- Wait longer (up to 60 seconds for first build)
- Check logs: `docker-compose logs frontend`

### Issue: Poor performance / Low FPS
**Solution**:
- Close other browser tabs
- Disable browser extensions
- Use Chrome or Edge for best performance
- Check if your system has sufficient RAM (4GB+ recommended)

## Testing the Features

### Test Virtualization
1. Open browser DevTools (F12)
2. In Console, run: `document.querySelectorAll('[data-test-id^="virtual-row-"]').length`
3. Should return ~50-70 (not 1,000,000!)
4. Scroll to middle of grid
5. Run the command again - should still be ~50-70

### Test Sorting
1. Click "Amount" column header
2. Verify first row shows lowest amount
3. Click again - should show highest amount

### Test Filtering
1. Type "Amazon" in the merchant filter
2. Wait 300ms (debounce delay)
3. Verify all visible rows show "Amazon"
4. Check filter count updates

### Test Quick Filters
1. Click "Completed" button
2. Verify all visible rows show "Completed" status
3. Click again to clear filter

### Test Row Selection
1. Click any row - should highlight
2. Hold Ctrl/Cmd and click another row
3. Both rows should be highlighted

### Test Cell Editing
1. Double-click any merchant cell
2. Type new value
3. Press Enter
4. Value should update

### Test Column Pinning
1. Click 📌 icon in "ID" column header
2. Scroll horizontally
3. ID column should stay fixed

## Performance Expectations

- **Initial Load**: 2-5 seconds (loading 150MB JSON file)
- **Scrolling FPS**: 55-60 FPS consistently
- **Rendered Rows**: 50-70 rows at any scroll position
- **Sort Operation**: < 500ms
- **Filter Operation**: < 300ms (after debounce)

## System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Docker**: Version 20.10+
- **Node.js**: Version 18+ (for data generation)

## File Sizes

- `public/transactions.json`: ~150 MB
- Docker image: ~50 MB
- `node_modules/`: ~100 MB

## Next Steps

After verifying the application works:

1. Review the code in `src/components/VirtualGrid.jsx` to understand the virtualization logic
2. Check the README.md for detailed architecture explanation
3. Experiment with the features
4. Monitor the debug panel while scrolling to see performance metrics

## Support

If you encounter issues not covered here, check:
- Docker logs: `docker-compose logs -f frontend`
- Browser console for JavaScript errors
- Network tab to verify transactions.json loads successfully
