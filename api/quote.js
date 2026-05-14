const indexMap = {
  DJIA: "^DJI",
  DOW: "^DJI",
  SPX: "^GSPC",
  SP500: "^GSPC",
  NDX: "^NDX",
  NASDAQ: "^IXIC",
  IXIC: "^IXIC",
  RUT: "^RUT",
};

function formatLargeNumber(value) {
  const num = Number(value || 0);
  if (!num) return "N/A";
  if (num >= 1_000_000_000_000) return `${(num / 1_000_000_000_000).toFixed(2)}T`;
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  return num.toLocaleString();
}

function cleanSymbol(value) {
  return String(value || "").trim().toUpperCase();
}

async function getYahooQuote(symbol) {
  const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(
    symbol
  )}`;

  const response = await fetch(yahooUrl);
  const data = await response.json();

  return data?.quoteResponse?.result?.[0] || null;
}

async function getFinnhubNews(symbol) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return [];

  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 30);

  const to = today.toISOString().slice(0, 10);
  const from = past.toISOString().slice(0, 10);

  const newsUrl = `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(
    symbol
  )}&from=${from}&to=${to}&token=${apiKey}`;

  const response = await fetch(newsUrl);
  const news = await response.json();

  if (!Array.isArray(news)) return [];

  return news.slice(0, 3).map((item) => ({
    headline: item.headline || "Market update",
    details: item.summary || "No summary was available for this news item.",
    url: item.url || "",
  }));
}

export default async function handler(req, res) {
  const rawSymbol = cleanSymbol(req.query.symbol);

  if (!rawSymbol) {
    return res.status(400).json({ error: "Missing stock symbol" });
  }

  const yahooSymbol = indexMap[rawSymbol] || rawSymbol;
  const isIndex = yahooSymbol.startsWith("^");

  try {
    const quote = await getYahooQuote(yahooSymbol);

    if (!quote) {
      return res.status(404).json({
        error: "No quote data found",
        symbol: rawSymbol,
        yahooSymbol,
      });
    }

    const price = Number(quote.regularMarketPrice || 0);
    const change = Number(quote.regularMarketChange || 0);
    const percent = Number(quote.regularMarketChangePercent || 0);

    let drivers = [];

    if (!isIndex) {
      drivers = await getFinnhubNews(rawSymbol);
    }

    if (drivers.length === 0) {
      drivers = [
        {
          headline: isIndex
            ? "Index is updating from live Yahoo Finance market data"
            : "Live quote loaded; no recent company news returned",
          details: `${rawSymbol} is updating from live market data.`,
          url: "",
        },
      ];
    }

    return res.status(200).json({
      ticker: rawSymbol,
      name:
        quote.longName ||
        quote.shortName ||
        quote.displayName ||
        rawSymbol,
      price,
      change,
      percent,
      volume: isIndex ? "Index" : formatLargeNumber(quote.regularMarketVolume),
      marketCap: isIndex ? "Index" : formatLargeNumber(quote.marketCap),
      signal: percent >= 0 ? "Positive" : "Negative",
      drivers,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch quote data",
      details: error.message,
    });
  }
}