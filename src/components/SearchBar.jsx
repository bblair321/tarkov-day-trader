import React from "react";
import "./SearchBar.css";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for items..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <div className="search-icon">🔍</div>
    </div>
  );
};

export default SearchBar;
