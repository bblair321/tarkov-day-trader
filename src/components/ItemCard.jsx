import React from "react";
import { calculateProfit, calculateROI } from "../services/tarkovApi";
import "./ItemCard.css";

const ItemCard = ({ item }) => {
  const fleaPrice = item.avg24hPrice;
  const lastLowPrice = item.lastLowPrice;
  const sellFor = item.sellFor || [];

  // Separate flea market and trader prices
  const fleaMarketSales = sellFor.filter(
    (sale) => sale.source === "flea-market"
  );
  const traderSales = sellFor.filter((sale) => sale.source !== "flea-market");

  // Get best flea price (highest)
  const bestFleaPrice =
    fleaMarketSales.length > 0
      ? Math.max(...fleaMarketSales.map((sale) => sale.price))
      : fleaPrice;

  // Get best trader price (highest)
  const bestTraderPrice =
    traderSales.length > 0
      ? Math.max(...traderSales.map((sale) => sale.price))
      : null;

  const profit = calculateProfit(bestFleaPrice, bestTraderPrice);
  const roi = calculateROI(bestFleaPrice, bestTraderPrice);

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `₽${price.toLocaleString()}`;
  };

  const getProfitClass = (profit) => {
    if (!profit) return "";
    return profit > 0 ? "profit-positive" : "profit-negative";
  };

  const formatCurrency = (currency) => {
    switch (currency) {
      case "₽":
        return "₽";
      case "$":
        return "$";
      case "€":
        return "€";
      default:
        return currency;
    }
  };

  return (
    <div className="item-card">
      <div className="item-header">
        <div className="item-image">
          {item.gridImageLink ? (
            <img src={item.gridImageLink} alt={item.name} />
          ) : (
            <div className="item-placeholder">📦</div>
          )}
        </div>
        <div className="item-name">
          <h3>{item.name}</h3>
          {item.shortName && item.shortName !== item.name && (
            <span className="item-short-name">({item.shortName})</span>
          )}
        </div>
      </div>

      <div className="item-prices">
        <div className="price-section">
          <div className="price-label">Flea Market (24h avg)</div>
          <div className="price-value flea-price">
            {formatPrice(bestFleaPrice)}
          </div>
          {lastLowPrice && lastLowPrice !== bestFleaPrice && (
            <div className="price-subtitle">
              Last Low: {formatPrice(lastLowPrice)}
            </div>
          )}
        </div>

        <div className="price-section">
          <div className="price-label">Best Trader Price</div>
          <div className="price-value trader-price">
            {formatPrice(bestTraderPrice)}
          </div>
        </div>

        {profit !== null && (
          <div className="profit-section">
            <div className="profit-label">Profit</div>
            <div className={`profit-value ${getProfitClass(profit)}`}>
              {profit > 0 ? "+" : ""}
              {formatPrice(profit)}
              {roi !== null && (
                <span className="roi-percentage">
                  ({roi > 0 ? "+" : ""}
                  {roi.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {traderSales.length > 0 && (
        <div className="trader-details">
          <div className="trader-label">Available at:</div>
          <div className="trader-list">
            {traderSales.map((sale, index) => (
              <span key={index} className="trader-tag">
                {sale.source}: {formatPrice(sale.price)}
                {sale.currency && sale.currency !== "₽" && (
                  <span className="currency">
                    {" "}
                    ({formatCurrency(sale.currency)})
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
