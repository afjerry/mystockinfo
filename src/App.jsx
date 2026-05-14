import React, { useEffect, useState } from "react";

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
  { symbol: "DJIA", name: "Dow Jones Industrial Average", value: "Loading...", change: 0, percent: 0, driver: { headline: "Loading live market data", details: "Live index data is loading.", url: "" } },
  { symbol: "SPX", name: "S&P 500", value: "Loading...", change: 0, percent: 0, driver: { headline: "Loading live market data", details: "Live index data is loading.", url: "" } },
  { symbol: "NDX", name: "Nasdaq 100", value: "Loading...", change: 0, percent: 0, driver: { headline: "Loading live market data", details: "Live index data is loading.", url: "" } },
  { symbol: "RUT", name: "Russell 2000", value: "Loading...", change: 0, percent: 0, driver: { headline: "Loading live market data", details: "Live index data is loading.", url: "" } },
];

const sampleStocks = [
  { ticker: "AAPL", name: "Apple Inc.", price: 0, change: 0, percent: 0, volume: "Loading...", marketCap: "Loading...", signal: "Loading", drivers: [] },
  { ticker: "MSFT", name: "Microsoft Corp.", price: 0, change: 0, percent: 0, volume: "Loading...", marketCap: "Loading...", signal: "Loading", drivers: [] },
  { ticker: "TSLA", name: "Tesla Inc.", price: 0, change: 0, percent: 0, volume: "Loading...", marketCap: "Loading...", signal: "Loading", drivers: [] },
  { ticker: "NVDA", name: "NVIDIA Corp.", price: 0, change: 0, percent: 0, volume: "Loading...", marketCap: "Loading...", signal: "Loading", drivers: [] },
];

function isRealUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url);
}

function signedNumber(value) {
  const safeValue = Number(value || 0);
  return `${safeValue >= 0 ? "+" : ""}${safeValue.toFixed(2)}`;
}

function openDriver(driver, setSelectedDriver) {
  if (isRealUrl(driver?.url)) {
    window.open(driver.url, "_blank", "noopener,noreferrer");
    return;
  }
  setSelectedDriver(driver);
}

function createPlaceholderStock(ticker) {
  return {
    ticker,
    name: ticker,
    price: 0,
    change: 0,
    percent: 0,
    volume: "Loading...",
    marketCap: "Loading...",
    signal: "Loading",
    drivers: [],
  };
}

function createPlaceholderIndex(symbol) {
  return {
    symbol,
    name: `${symbol} Market Index`,
    value: "Loading...",
    change: 0,
    percent: 0,
    driver: {
      headline: "Loading live index data",
      details: "Live index data is loading.",
      url: "",
    },
  };
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
          >
            <RemoveIcon size={14} />
          </button>
        </div>
        <p className="mt-5 leading-7 text-slate-600">{driver.details}</p>
        {isRealUrl(driver.url) ? (
          <a
            href={driver.url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white"
          >
            Open article <LinkIcon size={14} />
          </a>
        ) : (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            No article link is available for this item.
          </div>
        )}
      </div>
    </div>
  );
}

function PortfolioSummary({ stocks }) {
  const gainers = stocks.filter((stock) => Number(stock.change || 0) >= 0).length;
  const losers = stocks.length - gainers;
  const averageMove = stocks.length
    ? stocks.reduce((total, stock) => total + Number(stock.percent || 0), 0) / stocks.length
    : 0;

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
        <div className={`mt-2 text-3xl font-bold ${averageMove >= 0 ? "text-emerald-600" : "text-red-600"}`}>
          {signedNumber(averageMove)}%
        </div>
        <div className="mt-2 text-sm text-slate-500">Across your tracked names</div>
      </div>
    </div>
  );
}

function MarketIndexCard({ index, onRemove }) {
  const positive = Number(index.change || 0) >= 0;
  const [selectedDriver, setSelectedDriver] = useState(null);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold text-slate-950"><MarketIcon size={18} /> {index.symbol}</div>
          <div className="text-sm text-slate-500">{index.name}</div>
        </div>
        <button type="button" onClick={() => onRemove(index.symbol)} className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
          <RemoveIcon size={14} />
        </button>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <div className="text-3xl font-bold text-slate-950">{index.value}</div>
        <div className={`font-semibold ${positive ? "text-emerald-600" : "text-red-600"}`}>{signedNumber(index.change)} / {signedNumber(index.percent)}%</div>
      </div>
      <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); openDriver(index.driver, setSelectedDriver); }} className="mt-5 flex w-full items-start justify-between gap-3 rounded-2xl bg-slate-50 p-3 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">
        <span><span className="font-semibold text-slate-900">Market driver:</span> {index.driver?.headline || "Market update"}</span>
        <LinkIcon size={14} className="mt-0.5 shrink-0" />
      </button>
      <DriverDetailModal driver={selectedDriver} stock={{ ticker: index.symbol }} onClose={() => setSelectedDriver(null)} label="index market driver" />
    </div>
  );
}

function StockCard({ stock, onRemove }) {
  const positive = Number(stock.change || 0) >= 0;
  const [selectedDriver, setSelectedDriver] = useState(null);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl font-bold text-slate-950">{stock.ticker}</div>
          <div className="text-sm text-slate-500">{stock.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-2 ${positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
            {positive ? <TrendingUpIcon size={18} /> : <TrendingDownIcon size={18} />}
          </div>
          <button type="button" onClick={() => onRemove(stock.ticker)} className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
            <RemoveIcon size={14} />
          </button>
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <div className="text-3xl font-bold text-slate-950">${Number(stock.price || 0).toFixed(2)}</div>
        <div className={`font-semibold ${positive ? "text-emerald-600" : "text-red-600"}`}>{signedNumber(stock.change)} / {signedNumber(stock.percent)}%</div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-slate-50 p-3"><div className="text-slate-400">Volume</div><div className="font-semibold text-slate-900">{stock.volume}</div></div>
        <div className="rounded-2xl bg-slate-50 p-3"><div className="text-slate-400">Market Cap</div><div className="font-semibold text-slate-900">{stock.marketCap}</div></div>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900"><NewspaperIcon size={16} /> What’s moving it</div>
        <div className="space-y-2">
          {(stock.drivers || []).map((driver, index) => (
            <button key={`${stock.ticker}-${index}-${driver.headline}`} type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); openDriver(driver, setSelectedDriver); }} className="flex w-full items-start justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">
              <span>{driver.headline}</span><LinkIcon size={14} className="mt-0.5 shrink-0" />
            </button>
          ))}
        </div>
      </div>
      <DriverDetailModal driver={selectedDriver} stock={stock} onClose={() => setSelectedDriver(null)} />
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
        <input className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" value={ticker} onChange={(event) => setTicker(event.target.value.toUpperCase())} onKeyDown={(event) => { if (event.key === "Enter") submitTicker(); }} placeholder="Enter ticker symbol: AAPL, MSFT, TSLA..." />
      </label>
      <button type="button" className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700" onClick={submitTicker}><PlusIcon size={18} /> Add Stock</button>
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
        <input className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" value={symbol} onChange={(event) => setSymbol(event.target.value.toUpperCase())} onKeyDown={(event) => { if (event.key === "Enter") submitIndex(); }} placeholder="Add market index: DJIA, SPX, NDX, RUT..." />
      </label>
      <button type="button" className="flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800" onClick={submitIndex}><PlusIcon size={18} /> Add Index</button>
    </div>
  );
}

export default function App() {
  const [stocks, setStocks] = useState(() => {
    const savedTickers = localStorage.getItem("mystockinfo_tickers");
    if (!savedTickers) return sampleStocks;
    try {
      const tickers = JSON.parse(savedTickers);
      return tickers.map((ticker) => createPlaceholderStock(ticker));
    } catch {
      return sampleStocks;
    }
  });

  const [indexes, setIndexes] = useState(() => {
    const savedIndexes = localStorage.getItem("mystockinfo_indexes");
    if (!savedIndexes) return sampleIndexes;
    try {
      const symbols = JSON.parse(savedIndexes);
      return symbols.map((symbol) => createPlaceholderIndex(symbol));
    } catch {
      return sampleIndexes;
    }
  });

  const loadStock = async (ticker) => {
    const cleanTicker = ticker.trim().toUpperCase();
    if (!cleanTicker) return null;
    const response = await fetch(`/api/quote?symbol=${encodeURIComponent(cleanTicker)}`);
    const data = await response.json();
    if (!response.ok) {
      console.error("Stock API error", data);
      return null;
    }
    return {
      ticker: data.ticker || cleanTicker,
      name: data.name || cleanTicker,
      price: Number(data.price || 0),
      change: Number(data.change || 0),
      percent: Number(data.percent || 0),
      volume: data.volume || "N/A",
      marketCap: data.marketCap || "N/A",
      signal: data.signal || (Number(data.percent || 0) >= 0 ? "Positive" : "Negative"),
      drivers: Array.isArray(data.drivers) && data.drivers.length > 0 ? data.drivers : [{ headline: "Live market data loaded", details: `${cleanTicker} is updating from live market data.`, url: "" }],
    };
  };

  const loadIndex = async (symbol) => {
    const cleanSymbol = symbol.trim().toUpperCase();
    if (!cleanSymbol) return null;
    const response = await fetch(`/api/quote?symbol=${encodeURIComponent(cleanSymbol)}`);
    const data = await response.json();
    if (!response.ok) {
      console.error("Index API error", data);
      return null;
    }
    return {
      symbol: cleanSymbol,
      name: data.name || `${cleanSymbol} Market Index`,
      value: Number(data.price || 0).toLocaleString(),
      change: Number(data.change || 0),
      percent: Number(data.percent || 0),
      driver: Array.isArray(data.drivers) && data.drivers.length > 0 ? data.drivers[0] : { headline: "Live market data loaded", details: `${cleanSymbol} is updating from live market data.`, url: "" },
    };
  };

  useEffect(() => {
    const refreshStocks = async () => {
      const tickers = stocks.map((stock) => stock.ticker);
      const refreshed = await Promise.all(tickers.map((ticker) => loadStock(ticker)));
      const validStocks = refreshed.filter(Boolean);
      if (validStocks.length > 0) setStocks(validStocks);
    };
    refreshStocks();
  }, []);

  useEffect(() => {
    const refreshIndexes = async () => {
      const symbols = indexes.map((index) => index.symbol);
      const refreshed = await Promise.all(symbols.map((symbol) => loadIndex(symbol)));
      const validIndexes = refreshed.filter(Boolean);
      if (validIndexes.length > 0) setIndexes(validIndexes);
    };
    refreshIndexes();
  }, []);

  useEffect(() => {
    localStorage.setItem("mystockinfo_tickers", JSON.stringify(stocks.map((stock) => stock.ticker)));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem("mystockinfo_indexes", JSON.stringify(indexes.map((index) => index.symbol)));
  }, [indexes]);

  const addStock = async (ticker) => {
    const cleanTicker = ticker.trim().toUpperCase();
    if (!cleanTicker) return;
    const liveStock = await loadStock(cleanTicker);
    if (!liveStock) return;
    setStocks((currentStocks) => {
      const exists = currentStocks.some((stock) => stock.ticker === cleanTicker);
      if (exists) return currentStocks.map((stock) => (stock.ticker === cleanTicker ? liveStock : stock));
      return [liveStock, ...currentStocks];
    });
  };

  const removeStock = (ticker) => {
    setStocks((currentStocks) => currentStocks.filter((stock) => stock.ticker !== ticker));
  };

  const addIndex = async (symbol) => {
    const cleanSymbol = symbol.trim().toUpperCase();
    if (!cleanSymbol) return;
    const liveIndex = await loadIndex(cleanSymbol);
    if (!liveIndex) return;
    setIndexes((currentIndexes) => {
      const exists = currentIndexes.some((index) => index.symbol === cleanSymbol);
      if (exists) return currentIndexes.map((index) => (index.symbol === cleanSymbol ? liveIndex : index));
      return [liveIndex, ...currentIndexes];
    });
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
            <button type="button" className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-2 text-sm font-semibold shadow-sm"><ReportIcon size={16} /> Export Report</button>
            <button type="button" className="flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm"><BellIcon size={16} /> Create Alert</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">Executive Portfolio</div>
            <h1 className="text-5xl font-black tracking-tight">Your portfolio, clearly explained.</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Track your stocks, see the latest market movement, and quickly understand the news and catalysts driving each name.</p>
          </div>
        </section>

        <AddStockBar onAdd={addStock} />

        <section className="mt-8"><PortfolioSummary stocks={stocks} /></section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white/50 p-5">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold text-slate-950"><MarketIcon size={20} /> Market Indexes</div>
              <p className="mt-1 text-sm text-slate-500">Track major indexes separately from your individual stock watchlist.</p>
            </div>
          </div>
          <AddIndexBar onAdd={addIndex} />
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {indexes.map((index) => <MarketIndexCard key={index.symbol} index={index} onRemove={removeIndex} />)}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-950">Individual Stocks</h2>
            <p className="mt-1 text-sm text-slate-500">Your company-level watchlist and stock-specific catalysts.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stocks.map((stock) => <StockCard key={stock.ticker} stock={stock} onRemove={removeStock} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
