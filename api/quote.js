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

async function getYahooIndex(symbol) {
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
  };
}

async function getFinnhubVolume(symbol, apiKey) {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 10);

  const to = Math.floor(today.getTime() / 1000);
  const from = Math.floor(past.getTime() / 1000);

  const response = await fetch(
    `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(
      symbol
    )}&resolution=D&from=${from}&to=${to}&token=${apiKey}`
  );

  const data = await response.json();

  if (data?.s !== "ok" || !Array.isArray(data.v) || data.v.length === 0) {
    return 0;
  }

  return data.v[data.v.length - 1] || 0;
}

async function getFinnhubStock(symbol, apiKey) {
  const quoteResponse = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`
  );
  const quote = await quoteResponse.json();

  const profileResponse = await fetch(
    `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`
  );
  const profile = await profileResponse.json();

  const volume = await getFinnhubVolume(symbol, apiKey);

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

  const drivers = Array.isArray(news)
    ? news.slice(0, 3).map((item) => ({
        headline: item.headline || "Market update",
        details: item.summary || "No summary was available for this news item.",
        url: item.url || "",
      }))
    : [];

  return {
    price: Number(quote.c || 0),
    change: Number(quote.d || 0),
    percent: Number(quote.dp || 0),
    name: profile.name || symbol,
    volume: formatLargeNumber(volume),
    marketCap: profile.marketCapitalization
      ? `${Number(profile.marketCapitalization / 1000).toFixed(2)}B`
      : "N/A",
    drivers,
  };
}

export default async function handler(req, res) {
  const rawSymbol = String(req.query.symbol || "").trim().toUpperCase();

  if (!rawSymbol) {
    return res.status(400).json({ error: "Missing stock symbol" });
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  const yahooSymbol = indexMap[rawSymbol];
  const isIndex = Boolean(yahooSymbol);

  try {
    if (isIndex) {
      const indexQuote = await getYahooIndex(yahooSymbol);

      if (!indexQuote) {
        return res.status(404).json({
          error: "No index quote data found",
          symbol: rawSymbol,
          yahooSymbol,
        });
      }

      return res.status(200).json({
        ticker: rawSymbol,
        name: indexQuote.name,
        price: indexQuote.price,
        change: indexQuote.change,
        percent: indexQuote.percent,
        volume: "Index",
        marketCap: "Index",
        signal: indexQuote.percent >= 0 ? "Positive" : "Negative",
        drivers: [
          {
            headline: "Index is updating from live Yahoo Finance market data",
            details: `${rawSymbol} is updating from live index market data.`,
            url: "",
          },
        ],
      });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "Missing Finnhub API key" });
    }

    const stock = await getFinnhubStock(rawSymbol, apiKey);

    return res.status(200).json({
      ticker: rawSymbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      percent: stock.percent,
      volume: stock.volume || "N/A",
      marketCap: stock.marketCap || "N/A",
      signal: stock.percent >= 0 ? "Positive" : "Negative",
      drivers:
        stock.drivers.length > 0
          ? stock.drivers
          : [
              {
                headline: "Live market data from Finnhub",
                details: `${rawSymbol} is updating from Finnhub market data, but no recent article link was returned.`,
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