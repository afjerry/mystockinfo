export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({
      error: "Missing stock symbol",
    });
  }

  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Missing Finnhub API key",
    });
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );

    const quote = await response.json();

    return res.status(200).json({
      ticker: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Holdings`,
      price: Number(quote.c || 0),
      change: Number(quote.d || 0),
      percent: Number(quote.dp || 0),
      volume: "Live",
      marketCap: "Live",
      signal: Number(quote.dp || 0) >= 0 ? "Positive" : "Negative",
      drivers: [
        {
          headline: "Live market data from Finnhub",
          details: `${symbol.toUpperCase()} is updating from Finnhub market data.`,
          url: "#"
        }
      ]
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch stock data",
      details: error.message,
    });
  }
}