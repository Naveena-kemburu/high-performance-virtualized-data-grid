# High-Performance Virtualized Data Grid

A production-grade data grid capable of rendering 1 million rows of financial transaction data with smooth scrolling performance. This project demonstrates advanced frontend optimization techniques including virtual scrolling, efficient DOM manipulation, and large-scale state management.

## Features

- **Virtual Scrolling**: Renders only visible rows, maintaining constant DOM size regardless of dataset
- **1M Row Dataset**: Handles one million financial transactions without performance degradation
- **Sorting**: Click column headers to sort the entire dataset
- **Filtering**: Real-time text filtering with debouncing for optimal performance
- **Quick Filters**: One-click status filters (Completed, Pending, Failed)
- **Row Selection**: Single and multi-select with Ctrl/Cmd key support
- **Inline Editing**: Double-click cells to edit values
- **Column Pinning**: Pin ID and Date columns for horizontal scrolling
- **Performance Monitor**: Real-time FPS, rendered row count, and scroll position display

## Architecture

### Virtualization Strategy

The core virtualization logic implements a windowing technique:

1. **Viewport Calculation**: Only rows visible in the viewport (plus a buffer) are rendered
2. **Dynamic Positioning**: Uses `transform: translateY()` for GPU-accelerated positioning
3. **Scroll Optimization**: `requestAnimationFrame` ensures updates sync with browser refresh rate
4. **Constant DOM Size**: Maintains ~50-70 DOM nodes regardless of total dataset size

### Performance Optimizations

- **GPU Acceleration**: CSS transforms for smooth 60 FPS scrolling
- **Event Throttling**: Scroll events processed once per frame (~16ms)
- **Debounced Filtering**: 300ms debounce prevents excessive re-filtering
- **Memoization**: React useMemo for expensive computations (sorting/filtering)
- **Efficient Updates**: Only re-renders when visible row range changes

### Technical Stack

- **React 18**: Component-based UI with hooks
- **Vite**: Fast build tool and dev server
- **Docker**: Containerized deployment with Nginx
- **Vanilla CSS**: No framework overhead for maximum performance

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Running with Docker

```bash
# Clone the repository
git clone https://github.com/Naveena-kemburu/high-performance-virtualized-data-grid.git
cd high-performance-virtualized-data-grid

# Generate the 1M row dataset
npm install
npm run generate-data

# Build and start the application
docker-compose up -d

# Access the application
open http://localhost:8080
```

The application will be available at `http://localhost:8080` once the healthcheck passes.

### Local Development

```bash
# Install dependencies
npm install

# Generate test data
npm run generate-data

# Start development server
npm run dev

# Build for production
npm run build
```

## Data Generation

The project includes a script to generate 1 million synthetic financial transactions:

```bash
npm run generate-data
```

This creates `public/transactions.json` with the following schema:

```json
{
  "id": 0,
  "date": "2023-05-15T14:30:00.000Z",
  "merchant": "Amazon",
  "category": "Electronics",
  "amount": 1234.56,
  "status": "Completed",
  "description": "Online purchase"
}
```

## Usage Guide

### Sorting

Click any column header to sort. Click again to reverse the sort order. The sort indicator (▲/▼) shows the current direction.

### Filtering

- **Text Filter**: Type in the merchant filter input to search across all 1M rows
- **Quick Filters**: Click status buttons to filter by transaction status
- **Combined Filters**: Text and quick filters work together

### Row Selection

- **Single Select**: Click a row to select it
- **Multi-Select**: Hold Ctrl (Windows/Linux) or Cmd (Mac) while clicking

### Cell Editing

1. Double-click any cell to enter edit mode
2. Type your changes
3. Press Enter or click outside to save
4. Press Escape to cancel

### Column Pinning

Click the 📌 icon in the ID or Date column headers to pin/unpin them during horizontal scrolling.

## Performance Benchmarks

Expected performance metrics:

- **FPS**: 55-60 FPS during smooth scrolling
- **Rendered Rows**: 50-70 rows (constant, regardless of scroll position)
- **Initial Load**: < 3 seconds for 1M rows
- **Sort Time**: < 500ms for full dataset
- **Filter Time**: < 300ms for full dataset search

## Project Structure

```
.
├── Dockerfile                  # Multi-stage build with Nginx
├── docker-compose.yml          # Service orchestration
├── nginx.conf                  # Nginx configuration
├── package.json                # Dependencies and scripts
├── vite.config.js             # Vite build configuration
├── index.html                  # HTML entry point
├── scripts/
│   └── generate-data.js       # 1M row data generator
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Root component
│   ├── App.css                # App styles
│   ├── index.css              # Global styles
│   └── components/
│       ├── VirtualGrid.jsx    # Core virtualization logic
│       ├── VirtualGrid.css    # Grid styles
│       ├── DebugPanel.jsx     # Performance monitor
│       └── DebugPanel.css     # Debug panel styles
└── public/
    └── transactions.json      # Generated dataset (after npm run generate-data)
```
## Screenshots
<img width="800" height="360" alt="Screenshot 2026-02-21 212604" src="https://github.com/user-attachments/assets/e889df1f-ac40-41c2-9d21-2ceecbe5b224" />

<img width="1901" height="856" alt="Screenshot 2026-02-21 212922" src="https://github.com/user-attachments/assets/59cc60c9-994d-4eb2-b3c2-4ae93b0de843" />


## Implementation Details

### Virtual Scrolling Algorithm

```javascript
// Calculate visible range
const startIndex = Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE;
const endIndex = startIndex + visibleRowCount + (BUFFER_SIZE * 2);

// Slice data and render only visible rows
const visibleRows = data.slice(startIndex, endIndex);

// Position the window
const offsetY = startIndex * ROW_HEIGHT;
```

### Key Constants

- `ROW_HEIGHT`: 40px (fixed height per row)
- `BUFFER_SIZE`: 10 rows (rendered above/below viewport)
- `DEBOUNCE_DELAY`: 300ms (for filter input)

## Testing

The application includes `data-test-id` attributes for automated testing:

- `grid-scroll-container`: Main scrollable container
- `grid-row-window`: Rendered row container
- `virtual-row-{index}`: Individual row elements
- `header-{column}`: Column headers
- `filter-merchant`: Merchant filter input
- `quick-filter-{status}`: Quick filter buttons
- `debug-panel`: Performance monitor
- `debug-fps`, `debug-rendered-rows`, `debug-scroll-position`: Debug metrics

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

- Fixed row height (variable heights not supported)
- Horizontal scrolling requires sufficient viewport width
- Large filter operations may briefly impact responsiveness

## Future Enhancements

- Web Worker for off-thread sorting/filtering
- Virtual columns for extremely wide datasets
- Export to CSV functionality
- Advanced filtering (date ranges, numeric comparisons)
- Keyboard navigation (arrow keys)
- Column resizing
- Row virtualization with variable heights
