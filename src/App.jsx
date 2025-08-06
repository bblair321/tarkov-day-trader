import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ItemList from "./components/ItemList";
import { fetchTarkovItems } from "./services/tarkovApi";
import styles from "./App.module.css";

function App() {
  const [allItems, setAllItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all items
        const itemsData = await fetchTarkovItems();
        
        setAllItems(itemsData);
        
        // Select first 5 items for display, prioritizing items with flea market data
        const itemsWithFleaData = itemsData.filter((item) => {
          const sellFor = item.sellFor || [];
          const fleaMarketSell = sellFor.filter(
            (sale) =>
              sale.source === "fleaMarket" || sale.source === "flea-market"
          );
          return fleaMarketSell.length > 0 || item.avg24hPrice;
        });
        
        // Take first 5 items with flea data, or first 5 items if none have flea data
        const initialDisplayItems =
          itemsWithFleaData.length > 0
            ? itemsWithFleaData.slice(0, 5)
            : itemsData.slice(0, 5);
        
        setDisplayItems(initialDisplayItems);
      } catch (err) {
        setError(err.message || "Failed to load Tarkov market data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update display items when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Show first 5 items when no search
      const itemsWithFleaData = allItems.filter((item) => {
        const sellFor = item.sellFor || [];
        const fleaMarketSell = sellFor.filter(
          (sale) =>
            sale.source === "fleaMarket" || sale.source === "flea-market"
        );
        return fleaMarketSell.length > 0 || item.avg24hPrice;
      });
      
      const initialDisplayItems =
        itemsWithFleaData.length > 0
          ? itemsWithFleaData.slice(0, 5)
          : allItems.slice(0, 5);
      
      setDisplayItems(initialDisplayItems);
    } else {
      // Show all matching items when searching
      const searchLower = searchTerm.toLowerCase();
      const filteredItems = allItems.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(searchLower);
        const shortNameMatch = item.shortName
          ?.toLowerCase()
          .includes(searchLower);
        return nameMatch || shortNameMatch;
      });
      setDisplayItems(filteredItems);
    }
  }, [searchTerm, allItems]);

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.appTitle}>
              <span className={styles.titleIcon}>📈</span>
              Tarkov Day Trader
            </h1>
            <p className={styles.appSubtitle}>
              Real-time market analysis & price tracking
            </p>
          </div>
          
          <div className={styles.marketStatus}>
            <div className={styles.statusIndicator}>
              <div className={styles.statusDot}></div>
              Market Live
            </div>
            <span>•</span>
            <span>{allItems.length} items loaded</span>
          </div>
        </div>
      </header>

      <main className={styles.appMain}>
        <div className={styles.container}>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <ItemList
            items={displayItems}
            searchTerm={searchTerm}
            loading={loading}
            error={error}
            totalItems={allItems.length}
          />
        </div>
      </main>

      <footer className={styles.appFooter}>
        <div className={styles.container}>
          <p>
            Market data provided by{" "}
            <a
              href="https://api.tarkov.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              tarkov.dev
            </a>{" "}
            • Real-time updates every 5 minutes
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
