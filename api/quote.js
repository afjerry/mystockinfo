export default async function handler(req, res) {
  const symbol = String(req.query.symbol || "").toUpperCase();

  if (!symbol) {
    return res.status(400).json({ error: "Missing stock symbol" });
  }

  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing Finnhub API key" });
  }

  try {
    const quoteResponse = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    const quote = await quoteResponse.json();

    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 30);

    const to = today.toISOString().slice(0, 10);
    const from = past.toISOString().slice(0, 10);

    const newsResponse = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${apiKey}`
    );
    const news = await newsResponse.json();

    const drivers = Array.isArray(news)
      ? news.slice(0, 3).map((item) => ({
          headline: item.headline || "Market update",
          details: item.summary || "No summary was available for this news item.",
          url: item.url || "",
        }))
      : [];

    return res.status(200).json({
      ticker: symbol,
      name: `${symbol} Holdings`,
      price: Number(quote.c || 0),
      change: Number(quote.d || 0),
      percent: Number(quote.dp || 0),
      volume: "Live",
      marketCap: "Live",
      signal: Number(quote.dp || 0) >= 0 ? "Positive" : "Negative",
      drivers:
        drivers.length > 0
          ? drivers
          : [
              {
                headline: "Live market data from Finnhub",
                details: `${symbol} is updating from Finnhub market data, but no recent article link was returned.`,
                url: "",
              },
            ],
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch Finnhub data",
      details: error.message,
    });
  }
}