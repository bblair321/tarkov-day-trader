const TARKOV_API = "https://api.tarkov.dev/graphql";

// GraphQL query to fetch items with flea and trader prices
const ITEMS_QUERY = `
  {
    items(limit: 10000, offset: 0) {
      id
      name
      shortName
      avg24hPrice
      lastLowPrice
      gridImageLink
      sellFor {
        price
        currency
        source
      }
      buyFor {
        price
        currency
        source
      }
    }
  }
`;

// Query to get total count of items
const COUNT_QUERY = `
  {
    items {
      id
    }
  }
`;

// Query for sample data for the graph
const SAMPLE_DATA_QUERY = `
  {
    items(limit: 50) {
      id
      name
      shortName
      avg24hPrice
      lastLowPrice
      sellFor {
        price
        currency
        source
      }
      buyFor {
        price
        currency
        source
      }
    }
  }
`;

export const fetchTarkovItems = async () => {
  try {
    // First, let's check how many total items are available
    const countResponse = await fetch(TARKOV_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: COUNT_QUERY }),
    });

    if (countResponse.ok) {
      const countJson = await countResponse.json();
      if (!countJson.errors) {
        // Total items available in API
      }
    }

    const response = await fetch(TARKOV_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: ITEMS_QUERY }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    // Check for GraphQL errors
    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const items = json.data.items;

    // Filter out only the most common ammo items, but keep all other items
    const filteredItems = items.filter((item) => {
      // Exclude only the most common ammo items that clutter the results
      const name = item.name.toLowerCase();
      const shortName = item.shortName?.toLowerCase() || "";

      // Only exclude very common ammo types that aren't useful for trading
      const excludedTerms = ["m855", "5.56x45", "5.45x39", "7.62x39", "9x19"];
      const isExcluded = excludedTerms.some(
        (term) => name.includes(term) || shortName.includes(term)
      );

      // Keep all items except the excluded ammo types
      return !isExcluded;
    });

    return filteredItems; // Return all filtered items
  } catch (error) {
    console.error("Error fetching Tarkov items:", error);
    throw new Error(`Failed to load Tarkov market data: ${error.message}`);
  }
};

export const fetchSampleData = async () => {
  try {
    const response = await fetch(TARKOV_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: SAMPLE_DATA_QUERY }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const items = json.data.items;

    // Process items for graph data
    const graphData = items
      .filter((item) => {
        // Accept items with either flea market data OR avg24hPrice
        const sellFor = item.sellFor || [];
        const fleaMarketSell = sellFor.filter(
          (sale) =>
            sale.source === "fleaMarket" || sale.source === "flea-market"
        );

        // Include items with flea market data OR with avg24hPrice
        const hasFleaData = fleaMarketSell.length > 0;
        const hasAvgPrice = item.avg24hPrice && item.avg24hPrice > 0;

        return hasFleaData || hasAvgPrice;
      })
      .map((item) => {
        const sellFor = item.sellFor || [];
        const fleaMarketSell = sellFor.filter(
          (sale) =>
            sale.source === "fleaMarket" || sale.source === "flea-market"
        );

        // Get the best flea price, fallback to avg24hPrice
        let bestFleaPrice = null;
        if (fleaMarketSell.length > 0) {
          bestFleaPrice = Math.max(...fleaMarketSell.map((sale) => sale.price));
        } else if (item.avg24hPrice) {
          bestFleaPrice = item.avg24hPrice;
        }

        return {
          name: item.shortName || item.name.substring(0, 15),
          fleaPrice: bestFleaPrice,
          avgPrice: item.avg24hPrice,
          lastLow: item.lastLowPrice,
        };
      })
      .filter((item) => item.fleaPrice && item.fleaPrice > 0) // Only include items with valid prices
      .sort((a, b) => b.fleaPrice - a.fleaPrice) // Sort by price descending
      .slice(0, 10); // Limit to 10 items for the graph

    return graphData;
  } catch (error) {
    console.error("Error fetching sample data:", error);
    return [];
  }
};

// Helper function to calculate profit margin
export const calculateProfit = (fleaPrice, traderPrice) => {
  if (!fleaPrice || !traderPrice) return null;
  return fleaPrice - traderPrice;
};

// Helper function to calculate ROI percentage
export const calculateROI = (fleaPrice, traderPrice) => {
  if (!fleaPrice || !traderPrice) return null;
  return ((fleaPrice - traderPrice) / traderPrice) * 100;
};
