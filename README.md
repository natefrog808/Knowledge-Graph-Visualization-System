# Interactive Data Visualization Components

A collection of React components for interactive data visualization with statistical analysis capabilities.

## Features

### Chart Components
- **Interactive Area Chart**
  - Real-time hover effects
  - Point pinning for comparison
  - Interactive tooltips
  - Grid lines and visual guides
  - Smooth transitions

- **Candlestick Chart**
  - OHLC (Open, High, Low, Close) visualization
  - Color-coded up/down movements
  - Hover tooltips with detailed data
  - Customizable colors and dimensions

### Analysis Tools
- **Statistical Calculator**
  - Basic statistics (mean, median, mode)
  - Advanced measures (variance, standard deviation)
  - Quartile calculations
  - Outlier detection (IQR method)
  - Significant change detection

- **Comparison Features**
  - Pin points for detailed analysis
  - Delta calculations between points
  - Percentile rankings
  - Time span analysis
  - Statistical context

### Interactive Filtering
- Value range filtering
- Date range selection
- Statistical filtering options
- Outlier handling
- Real-time updates

## Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/interactive-data-visualization.git
cd interactive-data-visualization
```

2. **Install Dependencies**
```bash
npm install react react-dom lodash tailwindcss
```

3. **Configure TailwindCSS**
Create `tailwind.config.js`:
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

4. **Add TailwindCSS to Your CSS**
In your main CSS file:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Component Usage

### Area Chart
```jsx
import { InteractiveAreaChart } from './components/charts';

function TimeseriesView() {
  const data = [
    { timestamp: '2024-01-01', value: 0.75 },
    { timestamp: '2024-01-02', value: 0.82 },
    // ... more data points
  ];

  return (
    <InteractiveAreaChart
      data={data}
      width={800}
      height={400}
      color="#4CAF50"
    />
  );
}
```

### Candlestick Chart
```jsx
import { CandlestickChart } from './components/charts';

function PriceView() {
  const data = [
    {
      timestamp: '2024-01-01',
      open: 100,
      high: 105,
      low: 98,
      close: 103
    },
    // ... more price data
  ];

  return (
    <CandlestickChart
      data={data}
      width={800}
      height={400}
      upColor="#4CAF50"
      downColor="#FF5252"
    />
  );
}
```

### Filter Controls
```jsx
import { FilterControls } from './components/filters';

function DataFilters() {
  const handleFilterChange = (filters) => {
    console.log('New filters:', filters);
    // Apply filters to your data
  };

  return (
    <FilterControls
      data={yourData}
      onFilterChange={handleFilterChange}
      activeFilters={{
        minValue: 0,
        maxValue: 100,
        showOutliers: true,
        onlySignificant: false
      }}
    />
  );
}
```

### Comparison View
```jsx
import { ComparisonView } from './components/comparison';

function DataComparison() {
  const pinnedPoints = [
    { timestamp: '2024-01-01', value: 0.75 },
    { timestamp: '2024-01-10', value: 0.85 }
  ];

  return (
    <ComparisonView
      pinnedPoints={pinnedPoints}
      allData={completeDataset}
      onClose={() => console.log('Closing comparison view')}
    />
  );
}
```

### Complete Example
```jsx
import React, { useState } from 'react';
import { InteractiveAreaChart } from './components/charts';
import { FilterControls } from './components/filters';
import { ComparisonView } from './components/comparison';
import { StatsCalculator } from './utils';

function App() {
  const [filteredData, setFilteredData] = useState(yourData);
  const [pinnedPoints, setPinnedPoints] = useState([]);

  const handleFilterChange = (filters) => {
    const newData = yourData.filter(/* Apply filters */);
    setFilteredData(newData);
  };

  return (
    <div className="p-4">
      <FilterControls 
        data={yourData}
        onFilterChange={handleFilterChange}
      />
      <InteractiveAreaChart 
        data={filteredData}
        width={800}
        height={400}
      />
      {pinnedPoints.length > 0 && (
        <ComparisonView 
          pinnedPoints={pinnedPoints}
          allData={yourData}
          onClose={() => setPinnedPoints([])}
        />
      )}
    </div>
  );
}
```

## Props Reference

### InteractiveAreaChart
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | array | required | Array of {timestamp, value} objects |
| width | number | 200 | Chart width in pixels |
| height | number | 40 | Chart height in pixels |
| color | string | "#4CAF50" | Primary chart color |

### CandlestickChart
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | array | required | Array of OHLC objects |
| width | number | 200 | Chart width in pixels |
| height | number | 40 | Chart height in pixels |
| upColor | string | "#4CAF50" | Color for upward movements |
| downColor | string | "#FF5252" | Color for downward movements |

### FilterControls
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | array | required | Dataset to analyze |
| onFilterChange | function | required | Callback for filter updates |
| activeFilters | object | {} | Current filter state |

### ComparisonView
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| pinnedPoints | array | required | Points to compare |
| allData | array | required | Complete dataset |
| onClose | function | required | Close callback |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
