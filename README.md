# Knowledge Graph Visualization System

An advanced, interactive visualization system for exploring and analyzing knowledge graphs with real-time statistics, comparison features, and multiple visualization types.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Version](https://img.shields.io/badge/react-%3E%3D18.0.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E4.9.0-blue.svg)

## 🚀 Features

### Interactive Visualizations
- **Multiple Chart Types**
  - Interactive Area Charts with confidence trends
  - Candlestick visualization for volatility analysis
  - Sparkline for compact trend display
  - Bar charts for frequency analysis

### Advanced Analysis Tools
- **Statistical Analysis**
  - Comprehensive statistical measures (mean, median, mode, variance)
  - Quartile analysis and IQR calculations
  - Outlier detection
  - Significant change detection using z-scores

- **Comparison Features**
  - Pin multiple points for detailed comparison
  - Delta analysis between pinned points
  - Percentile rankings
  - Dataset-wide statistics

### Data Filtering
- **Flexible Filter Options**
  - Value range filtering
  - Date range selection with presets
  - Statistical filtering (outliers, significant changes)
  - Real-time updates with performance optimization

### User Experience
- **Intuitive Controls**
  - Smooth transitions between views
  - Interactive tooltips with detailed information
  - Keyboard navigation support
  - Accessible design with ARIA labels

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/knowledge-graph-viz.git

# Navigate to the project directory
cd knowledge-graph-viz

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 💻 Usage

### Basic Implementation

```jsx
import { KnowledgeGraph } from 'knowledge-graph-viz';

function App() {
  return (
    <KnowledgeGraph
      data={yourData}
      options={{
        layout: 'force',
        theme: 'light',
        enableComparison: true
      }}
    />
  );
}
```

### Advanced Configuration

```jsx
import { KnowledgeGraph, ComparisonView, FilterControls } from 'knowledge-graph-viz';

function AdvancedImplementation() {
  const handleFilterChange = (filters) => {
    // Handle filter updates
  };

  return (
    <div>
      <FilterControls
        data={data}
        onFilterChange={handleFilterChange}
        activeFilters={currentFilters}
      />
      <KnowledgeGraph
        data={filteredData}
        options={{
          layout: 'hierarchical',
          enablePinning: true,
          showStatistics: true,
          animations: {
            duration: 500,
            easing: 'easeInOutCubic'
          }
        }}
      />
      <ComparisonView
        pinnedPoints={selectedPoints}
        allData={data}
      />
    </div>
  );
}
```

## 📊 Visualization Types

### Area Chart
```jsx
<InteractiveAreaChart
  data={timeSeriesData}
  width={800}
  height={400}
  color="#4CAF50"
/>
```

### Candlestick Chart
```jsx
<CandlestickChart
  data={volatilityData}
  width={800}
  height={400}
  upColor="#4CAF50"
  downColor="#FF5252"
/>
```

## 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| layout | string | 'force' | Graph layout algorithm ('force', 'hierarchical', 'multilevel') |
| theme | string | 'light' | Visual theme ('light', 'dark', 'system') |
| enablePinning | boolean | true | Enable point pinning for comparison |
| showStatistics | boolean | true | Show statistical analysis panel |
| animations | object | {...} | Animation configuration options |

## 📈 Statistical Features

- **Basic Statistics**
  - Mean, Median, Mode
  - Standard Deviation
  - Variance
  - Quartiles (Q1, Q2, Q3)

- **Advanced Analysis**
  - Outlier Detection (IQR method)
  - Significant Change Detection (z-score based)
  - Trend Analysis
  - Correlation Detection

## 🎨 Styling

The system uses Tailwind CSS for styling and provides comprehensive theme customization:

```jsx
<KnowledgeGraph
  theme={{
    colors: {
      primary: '#4CAF50',
      secondary: '#2196F3',
      accent: '#FF4081'
    },
    fonts: {
      sans: 'Inter, sans-serif',
      mono: 'Fira Code, monospace'
    }
  }}
/>
```

## 🤝 Contributing

Contributions are welcome! 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License 

## 🙏 Acknowledgments

- React team for the amazing framework
- D3.js community for visualization inspiration
- Contributors and maintainers of all dependencies

---

Built with ❤️ by natefrog
