# Tarkov Day Trader 💰

A React web application that fetches live market data from Escape from Tarkov's flea market and trader system. It helps players track item prices in real-time, identify profitable trades, and compare flea vs trader values — like a stock trading dashboard, but for Tarkov.

## 🚀 Features

- **Real-time Market Data**: Fetches live data from tarkov.dev API
- **Price Comparisons**: Side-by-side flea market vs trader price comparisons
- **Profit Calculations**: Automatic profit margin and ROI calculations
- **Search Functionality**: Filter items by name in real-time
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## 🛠️ Tech Stack

- **React 19.1.0** - UI framework
- **Vite 7.0.4** - Build tool and dev server
- **GraphQL** - API queries to tarkov.dev
- **tarkov.dev API** - Provides real-time item, flea, and trader data
- **CSS3** - Modern styling with responsive design

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tarkov-day-trader
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 Usage

1. **Load the App**: The app automatically fetches market data when loaded
2. **Search Items**: Use the search bar to filter items by name
3. **Compare Prices**: View flea market vs trader prices for each item
4. **Analyze Profits**: See calculated profit margins and ROI percentages

## 📊 API Integration

The app integrates with the [tarkov.dev GraphQL API](https://api.tarkov.dev/graphql) to fetch:

- Item names and icons
- 24-hour average flea market prices
- Trader prices (Prapor, Therapist, etc.)
- Real-time market data
- Currency information (₽, $, €)

## 🎯 Example Use Case

A player wants to know if selling an item on the flea market is better than handing it to a trader. They:

1. Open the app
2. Search for the item name
3. See the comparison: "Flea: ₽120,000 vs Therapist: ₽85,000 → PROFIT: ₽35,000"

## 🏗️ Project Structure

```
src/
├── components/
│   ├── SearchBar.jsx      # Search functionality
│   ├── ItemCard.jsx       # Individual item display
│   ├── ItemList.jsx       # List of items with filtering
│   └── *.css             # Component styles
├── services/
│   └── tarkovApi.js      # API integration
├── App.jsx               # Main application component
└── main.jsx             # Application entry point
```

## 🚀 Deployment

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to platforms like:

- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Upload the `dist/` contents

## 🔮 Future Features

- [ ] Sort items by profit margin
- [ ] Favorite/starred items (localStorage)
- [ ] 24h price trend charts
- [ ] Price alerts and notifications
- [ ] Advanced filtering options
- [ ] Dark mode theme

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Data provided by [tarkov.dev](https://api.tarkov.dev)
- Built with React and Vite
- Icons and styling inspired by modern trading platforms
