import React from "react";
import styles from "./MarketGraph.module.css";

const MarketGraph = ({ data, loading }) => {
  if (loading) {
    return (
      <div className={styles.graphContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading market data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.graphContainer}>
        <div className={styles.noData}>
          <span>📊</span>
          <p>No market data available</p>
        </div>
      </div>
    );
  }

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return "N/A";
    if (price >= 1000000) {
      return `₽${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₽${(price / 1000).toFixed(0)}K`;
    }
    return `₽${price.toLocaleString()}`;
  };

  // Calculate chart dimensions
  const maxPrice = Math.max(...data.map((item) => item.fleaPrice || 0));
  const minPrice = Math.min(...data.map((item) => item.fleaPrice || 0));
  const priceRange = maxPrice - minPrice;
  const chartHeight = 200;
  const chartWidth = 400;
  const padding = 60;

  // Generate points for the line
  const points = data.map((item, index) => {
    const x =
      padding + (index / (data.length - 1)) * (chartWidth - padding * 2);
    const y =
      priceRange > 0
        ? padding +
          ((maxPrice - item.fleaPrice) / priceRange) *
            (chartHeight - padding * 2)
        : padding + (chartHeight - padding * 2) / 2;
    return { x, y, item };
  });

  // Create SVG path
  const pathData = points
    .map((point, index) => {
      return index === 0
        ? `M ${point.x} ${point.y}`
        : `L ${point.x} ${point.y}`;
    })
    .join(" ");

  return (
    <div className={styles.graphContainer}>
      <div className={styles.graphHeader}>
        <h3>Market Price Overview</h3>
        <p>Flea market prices for loaded items</p>
      </div>

      <div className={styles.lineChartContainer}>
        <svg
          width="100%"
          height="280"
          viewBox={`0 0 ${chartWidth + padding * 2} ${
            chartHeight + padding * 2
          }`}
          className={styles.lineChart}
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`grid-${i}`}
              x1={padding}
              y1={padding + (i * (chartHeight - padding * 2)) / 4}
              x2={chartWidth + padding}
              y2={padding + (i * (chartHeight - padding * 2)) / 4}
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="1"
            />
          ))}

          {/* Line path */}
          <path
            d={pathData}
            stroke="#10b981"
            strokeWidth="3"
            fill="none"
            className={styles.linePath}
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#10b981"
                className={styles.dataPoint}
              />
              <text
                x={point.x}
                y={point.y - 10}
                textAnchor="middle"
                className={styles.priceLabel}
                fontSize="10"
                fill="#94a3b8"
              >
                {formatPrice(point.item.fleaPrice)}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={`label-${index}`}
              x={point.x}
              y={chartHeight + padding + 20}
              textAnchor="middle"
              className={styles.itemLabel}
              fontSize="10"
              fill="#64748b"
            >
              {point.item.name}
            </text>
          ))}
        </svg>
      </div>

      <div className={styles.graphFooter}>
        <p>Showing flea market prices for {data.length} items</p>
      </div>
    </div>
  );
};

export default MarketGraph;
