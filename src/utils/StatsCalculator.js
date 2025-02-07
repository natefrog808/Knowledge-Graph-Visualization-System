// Stats Calculator utility class
const StatsCalculator = {
    calculateAll(data) {
      const values = data.map(d => d.value);
      return {
        mean: this.mean(values),
        median: this.median(values),
        mode: this.mode(values),
        variance: this.variance(values),
        stdDev: this.standardDeviation(values),
        quartiles: this.quartiles(values),
        min: Math.min(...values),
        max: Math.max(...values)
      };
    },

    mean(values) {
      return values.reduce((a, b) => a + b, 0) / values.length;
    },

    median(values) {
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    },

    mode(values) {
      const counts = new Map();
      values.forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
      let mode = values[0], maxCount = 0;
      for (const [value, count] of counts) {
        if (count > maxCount) {
          mode = value;
          maxCount = count;
        }
      }
      return mode;
    },

    variance(values) {
      const avg = this.mean(values);
      return this.mean(values.map(v => Math.pow(v - avg, 2)));
    },

    standardDeviation(values) {
      return Math.sqrt(this.variance(values));
    },

    quartiles(values) {
      const sorted = [...values].sort((a, b) => a - b);
      return {
        Q1: sorted[Math.floor(sorted.length * 0.25)],
        Q2: this.median(sorted),
        Q3: sorted[Math.floor(sorted.length * 0.75)]
      };
    },

    percentile(value, values) {
      const sorted = [...values].sort((a, b) => a - b);
      const index = sorted.findIndex(v => v >= value);
      return (index / (sorted.length - 1)) * 100;
    },

    detectOutliers(values) {
      const { Q1, Q3 } = this.quartiles(values);
      const IQR = Q3 - Q1;
      const lowerBound = Q1 - 1.5 * IQR;
      const upperBound = Q3 + 1.5 * IQR;
      return values.map(v => ({
        value: v,
        isOutlier: v < lowerBound || v > upperBound
      }));
    },

    significantChanges(values, threshold = 2) {
      const stdDev = this.standardDeviation(values);
      const mean = this.mean(values);
      return values.map((v, i) => ({
        value: v,
        isSignificant: Math.abs(v - mean) > threshold * stdDev
      }));
    }
};

export default StatsCalculator;
