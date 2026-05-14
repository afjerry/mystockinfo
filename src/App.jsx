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
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  return num.toLocaleString();
}

export default async function handler(req, res) {
  const rawSymbol = String(req.query.symbol || "").toUpperCase();

  if (!rawSymbol) {
    return res.status(400).json({ error: "Missing stock symbol" });
  }

  const yahooSymbol = indexMap[rawSymbol] || rawSymbol;
  const isIndex = yahooSymbol.startsWith("^");

  try {
    const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      yahooSymbol
    )}?interval=1d&range=5d`;

    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();
    const result = quoteData?.chart?.result?.[0];

    if (!result) {
      return res.status(404).json({
        error: "No quote data found",
        symbol: rawSymbol,
        yahooSymbol,
      });
    }

    const meta = result.meta || {};
    const price = Number(meta.regularMarketPrice || 0);
    const previousClose = Number(meta.previousClose || 0);
    const change = price - previousClose;
    const percent = previousClose ? (change / previousClose) * 100 : 0;

    let drivers = [];

    if (!isIndex && process.env.FINNHUB_API_KEY) {
      const today = new Date();
      const past = new Date();
      past.setDate(today.getDate() - 30);

      const to = today.toISOString().slice(0, 10);
      const from = past.toISOString().slice(0, 10);

      const newsResponse = await fetch(
        `https://finnhub.io/api/v1/company-news?symbol=${rawSymbol}&from=${from}&to=${to}&token=${process.env.FINNHUB_API_KEY}`
      );

      const news = await newsResponse.json();

      if (Array.isArray(news)) {
        drivers = news.slice(0, 3).map((item) => ({
          headline: item.headline || "Market update",
          details:
            item.summary ||
            "No summary was available for this news item.",
          url: item.url || "",
        }));
      }
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
      name: meta.longName || meta.shortName || rawSymbol,
      price,
      change,
      percent,
      volume: isIndex
        ? "Index"
        : formatLargeNumber(meta.regularMarketVolume),
      marketCap: isIndex
        ? "Index"
        : formatLargeNumber(meta.marketCap),
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