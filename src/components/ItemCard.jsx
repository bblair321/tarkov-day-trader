import React from "react";
import { calculateProfit, calculateROI } from "../services/tarkovApi";
import "./ItemCard.css";

const ItemCard = ({ item }) => {
  const avg24hPrice = item.avg24hPrice;
  const lastLowPrice = item.lastLowPrice;
  const sellFor = item.sellFor || [];
  const buyFor = item.buyFor || [];

  // Get flea market prices from sellFor (source can be "fleaMarket" or "flea-market")
  const fleaMarketSell = sellFor.filter(
    (sale) => sale.source === "fleaMarket" || sale.source === "flea-market"
  );
  const fleaMarketBuy = buyFor.filter(
    (buy) => buy.source === "fleaMarket" || buy.source === "flea-market"
  );
  const traderSales = sellFor.filter(
    (sale) => sale.source !== "fleaMarket" && sale.source !== "flea-market"
  );

  // Get best flea price (highest from sellFor, then buyFor, fallback to avg24hPrice)
  let bestFleaPrice = null;
  if (fleaMarketSell.length > 0) {
    bestFleaPrice = Math.max(...fleaMarketSell.map((sale) => sale.price));
  } else if (fleaMarketBuy.length > 0) {
    bestFleaPrice = Math.max(...fleaMarketBuy.map((buy) => buy.price));
  } else {
    bestFleaPrice = avg24hPrice;
  }

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

  // Determine what to show for flea market price
  const getFleaPriceDisplay = () => {
    if (bestFleaPrice) {
      return formatPrice(bestFleaPrice);
    }
    return "N/A";
  };

  // Determine the label based on available data
  const getFleaPriceLabel = () => {
    if (avg24hPrice) return "Flea Market (24h avg)";
    if (fleaMarketSell.length > 0 || fleaMarketBuy.length > 0)
      return "Flea Market Price";
    return "Flea Market Price";
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
          <div className="price-label">{getFleaPriceLabel()}</div>
          <div className="price-value flea-price">{getFleaPriceDisplay()}</div>
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
