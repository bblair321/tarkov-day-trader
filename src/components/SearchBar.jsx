import React from "react";
import styles from "./SearchBar.module.css";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search for items..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.searchIcon}>🔍</div>
    </div>
  );
};

export default SearchBar;
