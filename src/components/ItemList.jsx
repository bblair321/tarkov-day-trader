import React from "react";
import ItemCard from "./ItemCard";
import styles from "./ItemList.module.css";

const ItemList = ({ items, searchTerm, loading, error }) => {
  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (searchTerm && filteredItems.length === 0) {
    return (
      <div className={styles.noResults}>
        <div className={styles.noResultsIcon}>🔍</div>
        <h3>No items found</h3>
        <p>Try searching for a different item name</p>
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
      <div className={styles.resultsInfo}>
        Showing {filteredItems.length} of {items.length} items
        {searchTerm && ` for "${searchTerm}"`}
      </div>
      <div className={styles.itemsGrid}>
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
