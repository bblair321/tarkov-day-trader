import React from "react";
import { calculateProfit, calculateROI } from "../services/tarkovApi";
import styles from "./ItemCard.module.css";

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
    return profit > 0 ? styles.profitPositive : styles.profitNegative;
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
    <div className={styles.itemCard}>
      <div className={styles.itemHeader}>
        <div className={styles.itemImage}>
          {item.gridImageLink ? (
            <img src={item.gridImageLink} alt={item.name} />
          ) : (
            <div className={styles.itemPlaceholder}>📦</div>
          )}
        </div>
        <div className={styles.itemName}>
          <h3>{item.name}</h3>
          {item.shortName && item.shortName !== item.name && (
            <span className={styles.itemShortName}>({item.shortName})</span>
          )}
        </div>
      </div>

      <div className={styles.itemPrices}>
        <div className={styles.priceSection}>
          <div className={styles.priceLabel}>{getFleaPriceLabel()}</div>
          <div className={`${styles.priceValue} ${styles.fleaPrice}`}>
            {getFleaPriceDisplay()}
          </div>
          {lastLowPrice && lastLowPrice !== bestFleaPrice && (
            <div className={styles.priceSubtitle}>
              Last Low: {formatPrice(lastLowPrice)}
            </div>
          )}
        </div>

        <div className={styles.priceSection}>
          <div className={styles.priceLabel}>Best Trader Price</div>
          <div className={`${styles.priceValue} ${styles.traderPrice}`}>
            {formatPrice(bestTraderPrice)}
          </div>
        </div>

        {profit !== null && (
          <div className={styles.profitSection}>
            <div className={styles.profitLabel}>Profit</div>
            <div className={`${styles.profitValue} ${getProfitClass(profit)}`}>
              {profit > 0 ? "+" : ""}
              {formatPrice(profit)}
              {roi !== null && (
                <span className={styles.roiPercentage}>
                  ({roi > 0 ? "+" : ""}
                  {roi.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {traderSales.length > 0 && (
        <div className={styles.traderDetails}>
          <div className={styles.traderLabel}>Available at:</div>
          <div className={styles.traderList}>
            {traderSales.map((sale, index) => (
              <span key={index} className={styles.traderTag}>
                {sale.source}: {formatPrice(sale.price)}
                {sale.currency && sale.currency !== "₽" && (
                  <span className={styles.currency}>
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
