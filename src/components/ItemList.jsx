import React from "react";
import ItemCard from "./ItemCard";
import "./ItemList.css";

const ItemList = ({ items, searchTerm, loading, error }) => {
  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Tarkov market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error loading data</h3>
        <p>{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (searchTerm && filteredItems.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-icon">🔍</div>
        <h3>No items found</h3>
        <p>Try searching for a different item name</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="no-data">
        <div className="no-data-icon">📦</div>
        <h3>No market data available</h3>
        <p>Unable to load Tarkov market data at this time</p>
      </div>
    );
  }

  return (
    <div className="item-list">
      <div className="results-info">
        Showing {filteredItems.length} of {items.length} items
        {searchTerm && ` for "${searchTerm}"`}
      </div>
      <div className="items-grid">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
