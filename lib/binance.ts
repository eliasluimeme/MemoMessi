export async function getHighLowPrices(
  symbol: string,
  startTime: Date,
): Promise<{ highPrice: string; lowPrice: string }> {
  const start = startTime.getTime();
  const end = Date.now();
  const timeDiff = end - start;

  // Choose interval based on time difference
  let interval = '1m';
  if (timeDiff > 30 * 24 * 60 * 60 * 1000)
    // > 30 days
    interval = '1M';
  else if (timeDiff > 21 * 24 * 60 * 60 * 1000)
    // > 21 days
    interval = '1w';
  else if (timeDiff > 14 * 24 * 60 * 60 * 1000)
    // > 14 days
    interval = '3d';
  else if (timeDiff > 7 * 24 * 60 * 60 * 1000)
    // > 7 days
    interval = '1d';
  else if (timeDiff > 48 * 60 * 60 * 1000)
    // > 48 hours
    interval = '12h';
  else if (timeDiff > 24 * 60 * 60 * 1000)
    // > 24 hours
    interval = '8h';
  else if (timeDiff > 12 * 60 * 60 * 1000)
    // > 12 hours
    interval = '6h';
  else if (timeDiff > 8 * 60 * 60 * 1000)
    // > 8 hours
    interval = '4h';
  else if (timeDiff > 4 * 60 * 60 * 1000)
    // > 4 hours
    interval = '2h';
  else if (timeDiff > 2 * 60 * 60 * 1000)
    // > 2 hours
    interval = '1h';
  else if (timeDiff > 60 * 60 * 1000)
    // > 1 hour
    interval = '30m';
  else if (timeDiff > 30 * 60 * 1000)
    // > 30 minutes
    interval = '15m';
  else if (timeDiff > 15 * 60 * 1000)
    // > 15 minutes
    interval = '5m';
  else if (timeDiff > 5 * 60 * 1000)
    // > 5 minutes
    interval = '3m';

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${start}&endTime=${end}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return { highPrice: '0', lowPrice: '0' };

    const data = await response.json();
    if (!Array.isArray(data)) return { highPrice: '0', lowPrice: '0' };

    const prices = data.map((item: [number, string, string, string, string, string]) => ({
      highPrice: parseFloat(item[2]),
      lowPrice: parseFloat(item[3]),
    }));

    const highPrice = Math.max(...prices.map((p) => p.highPrice)).toString();
    const lowPrice = Math.min(...prices.map((p) => p.lowPrice)).toString();

    return { highPrice, lowPrice };
  } catch {
    return { highPrice: '0', lowPrice: '0' };
  }
}
