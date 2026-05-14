const indexMap = {
  DJIA: "^DJI",
  DOW: "^DJI",
  SPX: "^GSPC",
  SP500: "^GSPC",
  "S&P500": "^GSPC",
  NDX: "^NDX",
  NASDAQ: "^IXIC",
  IXIC: "^IXIC",
  RUT: "^RUT",
};

export default async function handler(req, res) {
  const rawSymbol = String(req.query.symbol || "").toUpperCase();

  if (!rawSymbol) {
    return res.status(400).json({ error: "Missing stock symbol" });
  }

  const yahooSymbol = indexMap[rawSymbol] || rawSymbol;

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

    const displayName =
      meta.longName ||
      meta.shortName ||
      meta.symbol ||
      rawSymbol;

    return res.status(200).json({
      ticker: rawSymbol,
      name: displayName,
      price,
      change,
      percent,
      volume: "Live",
      marketCap: "Live",
      signal: percent >= 0 ? "Positive" : "Negative",
      drivers: [
        {
          headline: "Live market data from Yahoo Finance",
          details: `${rawSymbol} is updating from Yahoo Finance market data.`,
          url: "",
        },
      ],
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch quote data",
      details: error.message,
    });
  }
}