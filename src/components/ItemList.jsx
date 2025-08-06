import React from "react";
import ItemCard from "./ItemCard";
import styles from "./ItemList.module.css";

const ItemList = ({ items, searchTerm, loading, error, totalItems }) => {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading Tarkov market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Error loading data</h3>
        <p>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (searchTerm && items.length === 0) {
    return (
      <div className={styles.noResults}>
        <div className={styles.noResultsIcon}>🔍</div>
        <h3>No items found</h3>
        <p>Try searching for a different item name</p>
        <div style={{ fontSize: "12px", marginTop: "8px", opacity: 0.7 }}>
          Searching through {totalItems} available items
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.noData}>
        <div className={styles.noDataIcon}>📦</div>
        <h3>No market data available</h3>
        <p>Unable to load Tarkov market data at this time</p>
      </div>
    );
  }

  return (
    <div className={styles.itemList}>
      {searchTerm && (
        <div className={styles.searchResults}>
          <p>Showing {items.length} results for "{searchTerm}"</p>
        </div>
      )}
      <div className={styles.itemsGrid}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
