import React, { useState, useCallback, useMemo } from 'react';
import _ from 'lodash';

const FilterControls = ({
  data,
  onFilterChange,
  activeFilters
}) => {
  const [localFilters, setLocalFilters] = useState(activeFilters);
  const stats = useMemo(() => StatsCalculator.calculateAll(data), [data]);
  const debounceUpdate = useCallback(
    _.debounce((filters) => onFilterChange(filters), 250),
    [onFilterChange]
  );

  const handleFilterChange = useCallback((updates) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    debounceUpdate(newFilters);
  }, [localFilters, debounceUpdate]);

  return (
    <div className="space-y-4" role="region" aria-label="Data filters">
      <div>
        <label 
          id="value-range-label" 
          className="text-sm font-medium block mb-1"
        >
          Value Range
        </label>
        <div 
          className="flex items-center gap-2"
          role="group" 
          aria-labelledby="value-range-label"
        >
          <input
            type="number"
            min={stats.min * 100}
            max={stats.max * 100}
            value={localFilters.minValue * 100 || 0}
            onChange={(e) => handleFilterChange({
              minValue: Math.max(stats.min, parseFloat(e.target.value) / 100)
            })}
            className="w-20 px-2 py-1 border rounded"
            aria-label="Minimum value"
          />
          <span aria-hidden="true">to</span>
          <input
            type="number"
            min={stats.min * 100}
            max={stats.max * 100}
            value={localFilters.maxValue * 100 || 100}
            onChange={(e) => handleFilterChange({
              maxValue: Math.min(stats.max, parseFloat(e.target.value) / 100)
            })}
            className="w-20 px-2 py-1 border rounded"
            aria-label="Maximum value"
          />
          <span aria-hidden="true">%</span>
        </div>
      </div>

      <div>
        <label 
          id="statistical-filters-label" 
          className="text-sm font-medium block mb-1"
        >
          Statistical Filters
        </label>
        <div 
          className="flex flex-wrap gap-3"
          role="group" 
          aria-labelledby="statistical-filters-label"
        >
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localFilters.showOutliers}
              onChange={(e) => handleFilterChange({
                showOutliers: e.target.checked
              })}
              className="mr-1"
            />
            <span>Show Outliers</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localFilters.onlySignificant}
              onChange={(e) => handleFilterChange({
                onlySignificant: e.target.checked
              })}
              className="mr-1"
            />
            <span>Only Significant Changes</span>
          </label>
          <select
            value={localFilters.significanceThreshold || 2}
            onChange={(e) => handleFilterChange({
              significanceThreshold: parseFloat(e.target.value)
            })}
            className="px-2 py-1 border rounded"
            aria-label="Significance threshold"
          >
            <option value={1}>1σ (68%)</option>
            <option value={2}>2σ (95%)</option>
            <option value={3}>3σ (99.7%)</option>
          </select>
        </div>
      </div>

      <div className="pt-2 border-t">
        <div className="text-sm font-medium mb-2">Current Statistics</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Mean: {(stats.mean * 100).toFixed(1)}%</div>
          <div>Median: {(stats.median * 100).toFixed(1)}%</div>
          <div>Std Dev: {(stats.stdDev * 100).toFixed(1)}%</div>
          <div>
            IQR: {((stats.quartiles.Q3 - stats.quartiles.Q1) * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
