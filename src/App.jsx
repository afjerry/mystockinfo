import React, { useState } from "react";

const Icon = ({ children, size = 18, className = "" }) => (
  <span
    className={`inline-flex items-center justify-center ${className}`}
    style={{ width: size, height: size, fontSize: size * 0.9, lineHeight: 1 }}
    aria-hidden="true"
  >
    {children}
  </span>
);

const SearchIcon = (props) => <Icon {...props}>⌕</Icon>;
const TrendingUpIcon = (props) => <Icon {...props}>↗</Icon>;
const TrendingDownIcon = (props) => <Icon {...props}>↘</Icon>;
const NewspaperIcon = (props) => <Icon {...props}>▤</Icon>;
const LinkIcon = (props) => <Icon {...props}>↗</Icon>;
const PlusIcon = (props) => <Icon {...props}>＋</Icon>;
const BellIcon = (props) => <Icon {...props}>◔</Icon>;
const RemoveIcon = (props) => <Icon {...props}>✕</Icon>;
const ReportIcon = (props) => <Icon {...props}>▦</Icon>;
const MarketIcon = (props) => <Icon {...props}>◆</Icon>;

const sampleIndexes = [
  {
    symbol: "DJIA",
    name: "Dow Jones Industrial Average",
    value: "39,872.44",
    change: 156.22,
    percent: 0.39,
    driver: {
      headline: "Blue-chip stocks are higher as investors rotate into profitable large-cap companies.",
      details: "The Dow Jones Industrial Average is often influenced by mature, profitable large-cap companies. A rotation into blue-chip stocks can happen when investors want more stable earnings, dividends, and defensive exposure.",
      url: "#djia-blue-chip-rotation"
    }
  },
  {
    symbol: "SPX",
    name: "S&P 500",
    value: "5,321.41",
    change: 42.18,
    percent: 0.8,
    driver: {
      headline: "Broad market strength is being helped by technology, financials, and easing rate concerns.",
      details: "The S&P 500 reflects a broad cross-section of large U.S. companies. When technology and financials both participate, the move is usually viewed as healthier than a narrow rally led by only a few mega-cap stocks.",
      url: "#spx-broad-market-strength"
    }
  },
  {
    symbol: "NDX",
    name: "Nasdaq 100",
    value: "18,771.03",
    change: 198.64,
    percent: 1.07,
    driver: {
      headline: "AI and semiconductor stocks are leading growth-heavy indexes higher.",
      details: "The Nasdaq 100 is heavily weighted toward large growth and technology companies. Strength in AI infrastructure, semiconductors, and cloud software can have an outsized effect on this index.",
      url: "#ndx-ai-semiconductor-strength"
    }
  },
  {
    symbol: "RUT",
    name: "Russell 2000",
    value: "2,083.19",
    change: -11.48,
    percent: -0.55,
    driver: {
      headline: "Small caps are lagging as investors remain cautious on interest-rate-sensitive companies.",
      details: "The Russell 2000 tracks smaller public companies, which are often more sensitive to borrowing costs and economic growth expectations. Higher-rate concerns can weigh on this part of the market.",
      url: "#rut-small-cap-rate-pressure"
    }
  }
];

const sampleStocks = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 212.48,
    change: 3.14,
    percent: 1.5,
    volume: "48.2M",
    marketCap: "3.21T",
    signal: "Positive",
    drivers: [
      {
        headline: "iPhone demand checks improved in Asia",
        details: "Recent supply-chain and channel checks suggest stronger iPhone demand in key Asian markets, which may support near-term revenue expectations.",
        url: "#aapl-iphone-demand"
      },
      {
        headline: "Services revenue expected to support margins",
        details: "Investors are watching Apple’s higher-margin services business because continued growth there can help offset slower hardware cycles.",
        url: "#aapl-services-margin"
      },
      {
        headline: "Analysts raised near-term price targets",
        details: "Positive analyst revisions can move sentiment when they point to better expected earnings, stronger product demand, or improving valuation support.",
        url: "#aapl-analyst-targets"
      }
    ]
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    price: 431.77,
    change: 5.86,
    percent: 1.38,
    volume: "22.9M",
    marketCap: "3.18T",
    signal: "AI strength",
    drivers: [
      {
        headline: "Azure growth remains a key upside driver",
        details: "Microsoft’s cloud growth is a major driver for the stock because Azure remains central to enterprise AI, data, and infrastructure spending.",
        url: "#msft-azure-growth"
      },
      {
        headline: "Copilot adoption continues across enterprise customers",
        details: "Investors are focused on whether Microsoft can turn AI tools like Copilot into durable subscription revenue across its enterprise base.",
        url: "#msft-copilot-adoption"
      },
      {
        headline: "Cloud software peers trading higher",
        details: "Strength across cloud software peers can lift Microsoft as investors rotate into companies expected to benefit from AI and enterprise software demand.",
        url: "#msft-cloud-peers"
      }
    ]
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: 184.09,
    change: -4.21,
    percent: -2.24,
    volume: "91.4M",
    marketCap: "587B",
    signal: "Volatile",
    drivers: [
      {
        headline: "EV margin concerns remain in focus",
        details: "Tesla investors are closely watching gross margins because price cuts and production costs can meaningfully affect profitability.",
        url: "#tsla-margin-concerns"
      },
      {
        headline: "Investors watching delivery growth trends",
        details: "Delivery numbers are a key demand signal for Tesla and can influence expectations for revenue growth, factory utilization, and market share.",
        url: "#tsla-delivery-growth"
      },
      {
        headline: "Robotaxi timeline uncertainty weighing on sentiment",
        details: "Tesla’s valuation partly reflects future autonomy expectations, so uncertainty around timing or execution can pressure investor sentiment.",
        url: "#tsla-robotaxi-timeline"
      }
    ]
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    price: 924.36,
    change: 18.74,
    percent: 2.07,
    volume: "57.7M",
    marketCap: "2.28T",
    signal: "Momentum",
    drivers: [
      {
        headline: "AI chip demand remains strong",
        details: "NVIDIA continues to benefit from demand for GPUs used in AI training, inference, and accelerated computing workloads.",
        url: "#nvda-ai-chip-demand"
      },
      {
        headline: "Data center revenue expectations rising",
        details: "Data center revenue is the key business line investors watch because it reflects demand from hyperscalers, cloud providers, and enterprise AI buyers.",
        url: "#nvda-data-center"
      },
      {
        headline: "Semiconductor sector seeing renewed inflows",
        details: "When investors rotate into semiconductors, NVIDIA often benefits because it is viewed as a leading AI infrastructure company.",
        url: "#nvda-sector-inflows"
      }
    ]
  }
];

function runPrototypeChecks() {
  console.assert(sampleIndexes.length >= 3, "Expected at least three sample market indexes.");
  console.assert(sampleIndexes.every((index) => index.symbol && index.name && index.value), "Every market index needs a symbol, name, and value.");
  console.assert(sampleIndexes.every((index) => index.driver && index.driver.headline && index.driver.details && index.driver.url), "Every market index needs a driver headline, details, and URL.");
  console.assert(sampleStocks.length >= 4, "Expected at least four sample stocks.");
  console.assert(sampleStocks.every((stock) => stock.ticker && stock.name), "Every stock needs a ticker and company name.");
  console.assert(sampleStocks.every((stock) => stock.price > 0), "Every stock needs a positive price.");
  console.assert(sampleStocks.every((stock) => Array.isArray(stock.drivers) && stock.drivers.length >= 3), "Every stock needs at least three market drivers.");
  console.assert(sampleStocks.every((stock) => stock.drivers.every((driver) => driver.headline && driver.details && driver.url)), "Every stock driver needs a headline, details, and URL.");
  return true;
}

runPrototypeChecks();

function signedNumber(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

function PortfolioSummary({ stocks }) {
  const gainers = stocks.filter((stock) => stock.change >= 0).length;
  const losers = stocks.length - gainers;
  const averageMove = stocks.reduce((total, stock) => total + stock.percent, 0) / stocks.length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-slate-500">Tracked Stocks</div>
        <div className="mt-2 text-3xl font-bold text-slate-950">{stocks.length}</div>
        <div className="mt-2 text-sm text-slate-500">Current watchlist size</div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-slate-500">Today’s Breadth</div>
        <div className="mt-2 text-3xl font-bold text-slate-950">{gainers} up / {losers} down</div>
        <div className="mt-2 text-sm text-slate-500">Based on latest market move</div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-slate-500">Average Move</div>
        <div className={`mt-2 text-3xl font-bold ${averageMove >= 0 ? "text-emerald-600" : "text-red-600"}`}>{signedNumber(averageMove)}%</div>
        <div className="mt-2 text-sm text-slate-500">Across your tracked names</div>
      </div>
    </div>
  );
}

function MarketIndexCard({ index, onRemove }) {
  const positive = index.change >= 0;
  const [selectedDriver, setSelectedDriver] = useState(null);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold text-slate-950">
            <MarketIcon size={18} /> {index.symbol}
          </div>
          <div className="text-sm text-slate-500">{index.name}</div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index.symbol)}
          className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          aria-label={`Remove ${index.symbol}`}
          title={`Remove ${index.symbol}`}
        >
          <RemoveIcon size={14} />
        </button>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div className="text-3xl font-bold text-slate-950">{index.value}</div>
        <div className={`font-semibold ${positive ? "text-emerald-600" : "text-red-600"}`}>
          {signedNumber(index.change)} / {signedNumber(index.percent)}%
        </div>
      </div>

      <button
        type="button"
        onClick={() => setSelectedDriver(index.driver)}
        className="mt-5 flex w-full items-start justify-between gap-3 rounded-2xl bg-slate-50 p-3 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
        title={`Read more about ${index.driver.headline}`}
      >
        <span><span className="font-semibold text-slate-900">Market driver:</span> {index.driver.headline}</span>
        <LinkIcon size={14} className="mt-0.5 shrink-0" />
      </button>

      <DriverDetailModal
        driver={selectedDriver}
        stock={{ ticker: index.symbol }}
        onClose={() => setSelectedDriver(null)}
        label="index market driver"
      />
    </div>
  );
}

function AddIndexBar({ onAdd }) {
  const [symbol, setSymbol] = useState("");

  const submitIndex = () => {
    const cleanSymbol = symbol.trim().toUpperCase();
    if (!cleanSymbol) return;
    onAdd(cleanSymbol);
    setSymbol("");
  };

  return (
    <div className="flex flex-wrap gap-3 rounded-3xl border bg-white p-3 shadow-sm">
      <label className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-slate-500">
        <MarketIcon size={18} />
        <input
          className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value.toUpperCase())}
          onKeyDown={(event) => {
            if (event.key === "Enter") submitIndex();
          }}
          placeholder="Add market index: DJIA, SPX, NDX, RUT..."
          aria-label="Market index symbol"
        />
      </label>
      <button
        type="button"
        className="flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800"
        onClick={submitIndex}
      >
        <PlusIcon size={18} /> Add Index
      </button>
    </div>
  );
}

function DriverDetailModal({ driver, stock, onClose, label = "market driver" }) {
  if (!driver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {stock.ticker} {label}
            </div>
            <h3 className="text-2xl font-bold text-slate-950">{driver.headline}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label="Close driver details"
          >
            <RemoveIcon size={14} />
          </button>
        </div>

        <p className="mt-5 leading-7 text-slate-600">{driver.details}</p>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          In the production app, this would open the full news article, earnings note, analyst report, or AI-generated explanation connected to your market data provider.
        </div>

        <a
          href={driver.url}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Read more details <LinkIcon size={16} />
        </a>
      </div>
    </div>
  );
}

function StockCard({ stock, onRemove }) {
  const positive = stock.change >= 0;
  const [selectedDriver, setSelectedDriver] = useState(null);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl font-bold text-slate-950">{stock.ticker}</div>
          <div className="text-sm text-slate-500">{stock.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-2 ${positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
            {positive ? <TrendingUpIcon size={18} /> : <TrendingDownIcon size={18} />}
          </div>
          <button
            type="button"
            onClick={() => onRemove(stock.ticker)}
            className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label={`Remove ${stock.ticker}`}
            title={`Remove ${stock.ticker}`}
          >
            <RemoveIcon size={14} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div className="text-3xl font-bold text-slate-950">${stock.price.toFixed(2)}</div>
        <div className={`font-semibold ${positive ? "text-emerald-600" : "text-red-600"}`}>
          {signedNumber(stock.change)} / {signedNumber(stock.percent)}%
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-slate-50 p-3">
          <div className="text-slate-400">Volume</div>
          <div className="font-semibold text-slate-900">{stock.volume}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <div className="text-slate-400">Market Cap</div>
          <div className="font-semibold text-slate-900">{stock.marketCap}</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
          <NewspaperIcon size={16} /> What’s moving it
        </div>
        <div className="space-y-2">
          {stock.drivers.map((driver, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedDriver(driver)}
              className="flex w-full items-start justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              title={`Read more about ${driver.headline}`}
            >
              <span>{driver.headline}</span>
              <LinkIcon size={14} className="mt-0.5 shrink-0" />
            </button>
          ))}
        </div>
      </div>
      <DriverDetailModal
        driver={selectedDriver}
        stock={stock}
        onClose={() => setSelectedDriver(null)}
      />
    </div>
  );
}

function AddStockBar({ onAdd }) {
  const [ticker, setTicker] = useState("");

  const submitTicker = () => {
    const cleanTicker = ticker.trim().toUpperCase();
    if (!cleanTicker) return;
    onAdd(cleanTicker);
    setTicker("");
  };

  return (
    <div className="flex flex-wrap gap-3 rounded-3xl border bg-white p-3 shadow-sm">
      <label className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-slate-500">
        <SearchIcon size={18} />
        <input
          className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
          value={ticker}
          onChange={(event) => setTicker(event.target.value.toUpperCase())}
          onKeyDown={(event) => {
            if (event.key === "Enter") submitTicker();
          }}
          placeholder="Enter ticker symbol: AAPL, MSFT, TSLA..."
          aria-label="Stock ticker symbol"
        />
      </label>
      <button
        type="button"
        className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        onClick={submitTicker}
      >
        <PlusIcon size={18} /> Add Stock
      </button>
    </div>
  );
}

function createPlaceholderIndex(symbol) {
  return {
    symbol,
    name: `${symbol} Market Index`,
    value: "—",
    change: symbol.length % 2 === 0 ? 41.25 : -18.7,
    percent: symbol.length % 2 === 0 ? 0.64 : -0.31,
    driver: {
      headline: "Connect a market data API to load the latest index level",
      details: "This placeholder index is ready to connect to a live market data API. In production, the app can summarize the main sectors, macro news, rates, or earnings trends moving the index.",
      url: "#connect-index-market-data"
    }
  };
}

function createPlaceholderStock(ticker) {
  return {
    ticker,
    name: `${ticker} Holdings`,
    price: 100 + ticker.length * 11.25,
    change: ticker.length % 2 === 0 ? 2.15 : -1.42,
    percent: ticker.length % 2 === 0 ? 1.36 : -0.88,
    volume: "—",
    marketCap: "—",
    signal: "New",
    drivers: [
      {
        headline: "Connect a market data API to load live price movement",
        details: "This placeholder stock is ready to connect to a live stock quote API for real-time or delayed price data.",
        url: "#connect-market-data"
      },
      {
        headline: "Connect a news API to summarize the latest stock catalysts",
        details: "A production version can connect to a financial news API and summarize the most important headlines affecting this ticker.",
        url: "#connect-news-api"
      },
      {
        headline: "Use alerts to monitor major price, volume, and news changes",
        details: "Alerts can notify you when a stock crosses a price level, moves sharply, or gets important breaking news.",
        url: "#create-stock-alerts"
      }
    ]
  };
}

export default function App() {
  const [stocks, setStocks] = useState(sampleStocks);
  const [indexes, setIndexes] = useState(sampleIndexes);

  const addStock = (ticker) => {
    const exists = stocks.some((stock) => stock.ticker === ticker);
    if (exists) return;
    setStocks((currentStocks) => [createPlaceholderStock(ticker), ...currentStocks]);
  };

  const removeStock = (ticker) => {
    setStocks((currentStocks) => currentStocks.filter((stock) => stock.ticker !== ticker));
  };

  const addIndex = (symbol) => {
    const exists = indexes.some((index) => index.symbol === symbol);
    if (exists) return;
    setIndexes((currentIndexes) => [createPlaceholderIndex(symbol), ...currentIndexes]);
  };

  const removeIndex = (symbol) => {
    setIndexes((currentIndexes) => currentIndexes.filter((index) => index.symbol !== symbol));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <div className="text-lg font-bold text-slate-950">MyStockInfo</div>
            <div className="text-sm text-slate-500">Executive Portfolio Dashboard</div>
          </div>
          <div className="flex gap-3">
            <button type="button" className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              <ReportIcon size={16} /> Export Report
            </button>
            <button type="button" className="flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              <BellIcon size={16} /> Create Alert
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Executive Portfolio
            </div>
            <h1 className="text-5xl font-black tracking-tight">Your portfolio, clearly explained.</h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Track your stocks, see the latest market movement, and quickly understand the news and catalysts driving each name.
            </p>
          </div>
        </section>

        <AddStockBar onAdd={addStock} />

        <section className="mt-8">
          <PortfolioSummary stocks={stocks} />
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white/50 p-5">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold text-slate-950">
                <MarketIcon size={20} /> Market Indexes
              </div>
              <p className="mt-1 text-sm text-slate-500">Track major indexes separately from your individual stock watchlist.</p>
            </div>
          </div>

          <AddIndexBar onAdd={addIndex} />

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {indexes.map((index) => (
              <MarketIndexCard key={index.symbol} index={index} onRemove={removeIndex} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-950">Individual Stocks</h2>
            <p className="mt-1 text-sm text-slate-500">Your company-level watchlist and stock-specific catalysts.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stocks.map((stock) => (
            <StockCard key={stock.ticker} stock={stock} onRemove={removeStock} />
          ))}
          </div>
        </section>
      </main>
    </div>
  );
}

