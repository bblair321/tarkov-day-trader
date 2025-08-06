const TARKOV_API = "https://api.tarkov.dev/graphql";

// GraphQL query to fetch items with flea and trader prices
const ITEMS_QUERY = `
  {
    items {
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
    }
  }
`;

export const fetchTarkovItems = async () => {
  try {
    console.log("Fetching data from tarkov.dev API...");

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

    console.log(`Successfully fetched ${json.data.items.length} items`);
    return json.data.items;
  } catch (error) {
    console.error("Error fetching Tarkov items:", error);
    throw new Error(`Failed to load Tarkov market data: ${error.message}`);
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
