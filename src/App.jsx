import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ItemList from "./components/ItemList";
import { fetchTarkovItems } from "./services/tarkovApi";
import styles from "./App.module.css";

function App() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTarkovItems();
        setItems(data);
      } catch (err) {
        setError(err.message || "Failed to load Tarkov market data");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.appTitle}>
            <span className={styles.titleIcon}>💰</span>
            Tarkov Day Trader
          </h1>
          <p className={styles.appSubtitle}>
            Real-time flea market vs trader price comparisons
          </p>
        </div>
      </header>

      <main className={styles.appMain}>
        <div className={styles.container}>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <ItemList
            items={items}
            searchTerm={searchTerm}
            loading={loading}
            error={error}
          />
        </div>
      </main>

      <footer className={styles.appFooter}>
        <div className={styles.container}>
          <p>
            Data provided by{" "}
            <a
              href="https://api.tarkov.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              tarkov.dev
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
