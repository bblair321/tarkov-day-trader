# Tarkov Day Trader

A React web application that fetches live market data from Escape from Tarkov's flea market and trader system. It helps players track item prices in real-time, identify profitable trades, and compare flea vs trader values — like a stock trading dashboard, but for Tarkov.

## Features

- **Real-time Market Data**: Fetches live data from tarkov.dev API
- **Price Comparisons**: Side-by-side flea market vs trader price comparisons
- **Profit Calculations**: Automatic profit margin and ROI calculations
- **Search Functionality**: Filter items by name in real-time
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## API Integration

The app integrates with the [tarkov.dev GraphQL API](https://api.tarkov.dev/graphql) to fetch:

- Item names and icons
- 24-hour average flea market prices
- Trader prices (Prapor, Therapist, etc.)
- Real-time market data
- Currency information (₽, $, €)

## Future Features

- [ ] Sort items by profit margin
- [ ] Favorite/starred items (localStorage)
- [ ] 24h price trend charts
- [ ] Price alerts and notifications
- [ ] Advanced filtering options