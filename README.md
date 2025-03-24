# Funding Pips - Senior Frontend Engineer Assessment

This is a real-time stock tracking application built with Next.js, TypeScript, and the custom `@wowjob/ui` library. It integrates with the Finnhub API to provide stock search functionality and live price updates for a predefined list of stocks and cryptocurrency pairs. The application features a watchlist with historical trend visualization using mock candle data.

## Setup

### Prerequisites

- **Node.js**: Version 18 or later
- **npm** or **yarn**: Package manager for installing dependencies
- **Finnhub API Key**: Obtainable by signing up at [finnhub.io](https://finnhub.io/)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone git@github.com:marianzburlea/funding-pips.git
   cd funding-pips
   ```

2. **Install Dependencies**:

   ```bash
   npm i

   # or

   yarn install
   # or

   bun i
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Finnhub API credentials:

   ```env
   FINHUB_API_KEY=your_api_key_here
   FINHUB_API_SECRET=your_api_secret_here
   ```

4. **Run the Development Server**:

   ```bash
   npm run dev

   # or

   yarn dev
   # or

   bun dev
   ```

5. **Access the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Project Structure

- **`src/app`**: Core application files, including pages (`page.tsx`), layouts (`layout.tsx`), and API routes (`api/`).
- **`src/component`**: Reusable React components like `StockSearch`, `LastPrice`, and `StockChart`.
- **`src/util`**: Utility functions, including mock data generation for historical candle data (`mock/candle.ts`).
- **`src/type`**: TypeScript type definitions for stock data, search results, and candle responses.
- **`src/store.ts`**: Zustand store for managing stock prices and watchlist state with persistence.

## Technologies Used

- **Next.js**: Framework for server-side rendering, API routes, and file-based routing.
- **TypeScript**: Ensures type safety and improves developer experience.
- **@wowjob/ui**: Custom CSS utility library for styling with zero build time (see comparison below).
- **Zustand**: Lightweight state management library with persistence for the watchlist.
- **Finnhub API**: Provides real-time stock quotes and search functionality.
- **Chart.js**: Renders historical stock price trends in the watchlist.

## Features

### Stock Search

- Search for stocks or assets by name or symbol using the Finnhub API.
- Results display the symbol and description, cached for 5 minutes using `unstable_cache`.
- Debounced internally via client-side handling to reduce API calls.

### Live Price Updates

- Polls the Finnhub API every 5 seconds to fetch prices for a predefined list of symbols (e.g., AAPL, MSFT, BTCUSDT).
- Displays the latest price and timestamp for each symbol.
- Handles fetch errors gracefully, skipping unavailable data.

### Historical Trends

- Visualizes historical price trends for watchlist items using mock candle data.
- Data includes open, high, low, close prices, and volume, generated for supported symbols (AAPL, MSFT, etc.).
- Rendered as a line chart with Chart.js.

### Watchlist Management

- Users can add or remove stocks from a persistent watchlist.
- Watchlist state is managed with Zustand and persists across sessions.
- Each watchlist item displays a historical price chart.

## Comparison: Tailwind CSS vs. @wowjob/ui

### Tailwind CSS

- **Utility-First**: Provides pre-defined utility classes (e.g., `p-4`, `bg-blue-500`) for rapid styling.
- **Build-Time Dependency**: Requires a build step with PostCSS or a similar tool to generate CSS, adding complexity to the setup.
- **Learning Curve**: Requires learning specific class names and shorthand syntax, which may differ from standard CSS.
- **File Size**: Generated CSS can grow large unless purged, requiring additional configuration for optimization.
- **Responsiveness**: Uses prefixes (e.g., `sm:`, `md:`) for responsive design, applied per utility.

### Tailwind CSS example:

Input and output:

```
<a
  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
  href="https://wowjob.ai"
  target="_blank"
  rel="noopener noreferrer"
>
  Deploy now
</a>
```

### @wowjob/ui (Custom Library written my myself)

- **Zero Build Time**: No bundlers or watchers needed—just import `reset.css` and `all.css` (or `all.min.css` for production) and start styling instantly.
- **CSS Familiarity**: Leverages standard CSS knowledge with a simple API (`getStyle`), reducing the learning curve to 1–2 minutes.
- **Mobile-First Approach**: Define base styles under `mobile` and override with `desktop` or other breakpoints, streamlining responsive design.
- **Flexibility**: Returns both class names and inline styles, allowing seamless integration with any framework (e.g., React, Next.js) and supporting dynamic styling.
- **Lightweight**: Minimal configuration and no build step result in a smaller footprint and faster development cycles.
- **Best DX**: Autocomplete support in editors and a debugging experience akin to raw CSS, thanks to its straightforward structure.

### Benefits of @wowjob/ui in This Project

- **Speed**: Eliminated the need for Tailwind’s build process, enabling instant setup and iteration, critical for a 4-6 hour assessment.
- **Simplicity**: Used familiar CSS properties via `getStyle` (e.g., `mobile: { padding: 16 }`), making the codebase intuitive and maintainable.
- **Scalability**: Supports server and client components in Next.js without additional tooling, fitting seamlessly into the app’s architecture.
- **Custom Themes**: Applied themes (e.g., `theme: "secondary"`) for consistent styling, reducing repetitive code compared to Tailwind’s class repetition.
- **No Overhead**: Avoided Tailwind’s potential CSS bloat, ensuring a lean production build with `all.min.css`.

While Tailwind excels in rapid prototyping with its extensive utility set, `@wowjob/ui` was chosen for its zero-configuration simplicity, alignment with CSS expertise, and superior developer experience, making it ideal for this project’s constraints and goals.

#### @wowjob/ui Example

##### Input

```
<Flex
  mobile={{
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(2, 1fr)',
  }}
  tablet={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
  desktop={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
>
```

##### Development Ouput

```
<div class="wowjob-ui-flex display gap grid-template-columns tablet desktop" style="--display: grid; --gap: 1rem; --grid-template-columns: repeat(2, 1fr); --t-grid-template-columns: repeat(4, 1fr); --d-grid-template-columns: repeat(6, 1fr);">
```

##### Production Ouput

```
<div class="wowjob-ui-flex  ds gp gtc tablet desktop" style="--ds: grid; --gp: 1rem; --gtc: repeat(2, 1fr); --t-gtc: repeat(4, 1fr); --d-gtc: repeat(6, 1fr);">
```

## Trade-offs and Decisions

- **Polling vs. WebSockets**: Polling is used for simplicity and time constraints. WebSockets (partially implemented via POST API) would offer true real-time updates but require additional setup.
- **Mock Historical Data**: Real historical data requires a paid Finnhub plan; mock data simulates this feature for assessment purposes.
- **Error Handling**: Basic error handling is in place (e.g., fetch failures), with user-friendly messages displayed via the `ErrorMessage` component.
- **Caching**: Search results are cached for 5 minutes to reduce API calls, balancing freshness and performance.

## Future Improvements

- **Implement WebSockets**: Fully integrate WebSocket support for real-time updates, replacing polling.
- **Real Historical Data**: Upgrade to a paid Finnhub plan or alternative API for authentic candle data.
- **Enhanced Error Handling**: Add loading states and more detailed error feedback.
- **Testing**: Expand unit tests for client-side components and edge cases.
- **Optimization**: Introduce API call throttling or server-side caching for better performance.

This README provides all necessary information to understand, set up, and extend the project. Contributions and feedback are welcome!
