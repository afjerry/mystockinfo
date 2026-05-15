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

async function getYahooQuote(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?interval=1d&range=5d`;

  const response = await fetch(url);
  const data = await response.json();
  const result = data?.chart?.result?.[0];

  if (!result) return null;

  const meta = result.meta || {};
  const price = Number(meta.regularMarketPrice || 0);
  const previousClose = Number(meta.previousClose || meta.chartPreviousClose || 0);
  const change = price - previousClose;
  const percent = previousClose ? (change / previousClose) * 100 : 0;

  return {
    price,
    change,
    percent,
    name: meta.longName || meta.shortName || symbol,
    volume: meta.regularMarketVolume || 0,
  };
}

async function getFinnhubNews(symbol, apiKey) {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 30);

  const to = today.toISOString().slice(0, 10);
  const from = past.toISOString().slice(0, 10);

  const newsResponse = await fetch(
    `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(
      symbol
    )}&from=${from}&to=${to}&token=${apiKey}`
  );

  const news = await newsResponse.json();

  return Array.isArray(news)
    ? news.slice(0, 3).map((item) => ({
        headline: item.headline || "Market update",
        details: item.summary || "No summary was available for this news item.",
        url: item.url || "",
      }))
    : [];
}

async function getFinnhubProfile(symbol, apiKey) {
  const profileResponse = await fetch(
    `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(
      symbol
    )}&token=${apiKey}`
  );

  return profileResponse.json();
}

export default async function handler(req, res) {
  const rawSymbol = String(req.query.symbol || "").trim().toUpperCase();

  if (!rawSymbol) {
    return res.status(400).json({ error: "Missing stock symbol" });
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  const yahooSymbol = indexMap[rawSymbol] || rawSymbol;
  const isIndex = Boolean(indexMap[rawSymbol]);

  try {
    const yahooQuote = await getYahooQuote(yahooSymbol);

    if (!yahooQuote) {
      return res.status(404).json({
        error: "No quote data found",
        symbol: rawSymbol,
        yahooSymbol,
      });
    }

    if (isIndex) {
      return res.status(200).json({
        ticker: rawSymbol,
        name: yahooQuote.name,
        price: yahooQuote.price,
        change: yahooQuote.change,
        percent: yahooQuote.percent,
        volume: "Index",
        marketCap: "Index",
        signal: yahooQuote.percent >= 0 ? "Positive" : "Negative",
        drivers: [
          {
            headline: "Index is updating from live Yahoo Finance market data",
            details: `${rawSymbol} is updating from live index market data.`,
            url: "",
          },
        ],
      });
    }

    let profile = {};
    let drivers = [];

    if (apiKey) {
      profile = await getFinnhubProfile(rawSymbol, apiKey);
      drivers = await getFinnhubNews(rawSymbol, apiKey);
    }

    return res.status(200).json({
      ticker: rawSymbol,
      name: profile.name || yahooQuote.name || rawSymbol,
      price: yahooQuote.price,
      change: yahooQuote.change,
      percent: yahooQuote.percent,
      volume: formatLargeNumber(yahooQuote.volume),
      marketCap: profile.marketCapitalization
        ? `${Number(profile.marketCapitalization / 1000).toFixed(2)}B`
        : "N/A",
      signal: yahooQuote.percent >= 0 ? "Positive" : "Negative",
      drivers:
        drivers.length > 0
          ? drivers
          : [
              {
                headline: "Live market data loaded",
                details: `${rawSymbol} is updating from live market data, but no recent article link was returned.`,
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