// ─── HISTORY GENERATOR ───────────────────────────────────────────────────────
export const genHistory = (base, vol, days = 30) => {
  const out = [];
  let p = base;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    p = Math.max(1, p + (Math.random() - 0.47) * vol);
    out.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(p.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }
  return out;
};

// ─── STOCKS ──────────────────────────────────────────────────────────────────
export const STOCKS = {
  AAPL: { symbol: 'AAPL', name: 'Apple Inc.',       sector: 'Technology',    price: 189.43, change:  2.31, changePct:  1.24, marketCap: '2.94T', pe: 31.2, volume: '58.4M',  history: genHistory(175, 3)  },
  MSFT: { symbol: 'MSFT', name: 'Microsoft Corp.',  sector: 'Technology',    price: 374.12, change: -1.88, changePct: -0.50, marketCap: '2.78T', pe: 36.8, volume: '22.1M',  history: genHistory(360, 5)  },
  TSLA: { symbol: 'TSLA', name: 'Tesla Inc.',       sector: 'EV / Auto',     price: 248.79, change:  7.54, changePct:  3.12, marketCap: '791B',  pe: 68.4, volume: '112.3M', history: genHistory(220, 8)  },
  NVDA: { symbol: 'NVDA', name: 'NVIDIA Corp.',     sector: 'Semiconductors',price: 621.44, change: 18.22, changePct:  3.02, marketCap: '1.53T', pe: 65.1, volume: '44.8M',  history: genHistory(570, 12) },
  AMZN: { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'E-Commerce',    price: 178.25, change: -0.93, changePct: -0.52, marketCap: '1.85T', pe: 42.3, volume: '31.6M',  history: genHistory(165, 4)  },
  GOOGL:{ symbol: 'GOOGL',name: 'Alphabet Inc.',   sector: 'Technology',    price: 141.80, change:  0.65, changePct:  0.46, marketCap: '1.78T', pe: 25.7, volume: '27.2M',  history: genHistory(135, 3)  },
  META: { symbol: 'META', name: 'Meta Platforms',  sector: 'Social Media',  price: 484.10, change:  5.20, changePct:  1.09, marketCap: '1.24T', pe: 23.4, volume: '18.9M',  history: genHistory(460, 7)  },
  JPM:  { symbol: 'JPM',  name: 'JPMorgan Chase',  sector: 'Finance',       price: 196.85, change: -2.10, changePct: -1.06, marketCap: '567B',  pe: 11.8, volume: '9.7M',   history: genHistory(190, 3)  },
};

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
export const PORTFOLIO = [
  { symbol: 'AAPL', shares: 50, avgCost: 155.20 },
  { symbol: 'NVDA', shares: 20, avgCost: 480.00 },
  { symbol: 'TSLA', shares: 30, avgCost: 210.50 },
  { symbol: 'MSFT', shares: 15, avgCost: 320.00 },
  { symbol: 'META', shares: 10, avgCost: 390.00 },
];

// ─── MARKET INDICES ───────────────────────────────────────────────────────────
export const INDICES = [
  { name: 'S&P 500', value: '4,783.45',  change: '+0.87%', up: true  },
  { name: 'NASDAQ',  value: '15,234.70', change: '+1.12%', up: true  },
  { name: 'DOW',     value: '37,592.30', change: '-0.23%', up: false },
  { name: 'VIX',     value: '13.42',     change: '-4.10%', up: false },
];

// ─── NEWS ─────────────────────────────────────────────────────────────────────
export const NEWS = [
  { id: 1, headline: 'Fed signals potential rate cuts amid cooling inflation data',        source: 'Reuters',     time: '2h ago', tag: 'MACRO', sentiment: 'bullish' },
  { id: 2, headline: 'NVIDIA surges on record data center revenue forecast',               source: 'Bloomberg',   time: '3h ago', tag: 'NVDA',  sentiment: 'bullish' },
  { id: 3, headline: 'Apple faces EU scrutiny over App Store DMA compliance',             source: 'FT',          time: '5h ago', tag: 'AAPL',  sentiment: 'bearish' },
  { id: 4, headline: 'Tesla Q4 deliveries beat estimates despite EV slowdown',            source: 'WSJ',         time: '6h ago', tag: 'TSLA',  sentiment: 'bullish' },
  { id: 5, headline: 'JPMorgan warns of rising credit card delinquencies in 2025',       source: 'CNBC',        time: '8h ago', tag: 'JPM',   sentiment: 'bearish' },
  { id: 6, headline: 'Meta AI assistant crosses 500M monthly active users',               source: 'TechCrunch',  time: '9h ago', tag: 'META',  sentiment: 'bullish' },
];