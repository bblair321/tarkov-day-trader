import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ItemList from "./components/ItemList";
import { fetchTarkovItems } from "./services/tarkovApi";
import "./App.css";

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
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">💰</span>
            Tarkov Day Trader
          </h1>
          <p className="app-subtitle">
            Real-time flea market vs trader price comparisons
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <ItemList
            items={items}
            searchTerm={searchTerm}
            loading={loading}
            error={error}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            Data provided by{" "}
            <a
              href="https://tarkov-tools.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Tarkov Tools
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
