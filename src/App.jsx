import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Plus, Eye, Newspaper, BarChart2, Briefcase, X } from 'lucide-react'
import { STOCKS, PORTFOLIO, INDICES, NEWS } from './mockdata'
import './App.css'

// ─── CHART TOOLTIP ─
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const color = payload[0].stroke
  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">{label}</div>
      <div className="tooltip-value" style={{ color }}>${payload[0].value.toFixed(2)}</div>
    </div>
  )
}

// ─── LIVE CLOCK 
const Clock = () => {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="topbar-clock">
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} EST
    </span>
  )
}

// ─── TOPBAR 
const Topbar = () => {
  const items = [...Object.values(STOCKS), ...Object.values(STOCKS)]
  return (
    <div className="topbar">
      <div className="topbar-logo">
        <span className="topbar-dot" />
        STOCKPULSE
      </div>

      <div className="ticker-wrap">
        <div className="ticker-track">
          {items.map((s, i) => (
            <div className="ticker-item" key={i}>
              <span className="ticker-sym">{s.symbol}</span>
              <span className="ticker-val">${s.price.toFixed(2)}</span>
              <span className={s.changePct >= 0 ? 'up' : 'dn'}>
                {s.changePct >= 0 ? '▲' : '▼'} {Math.abs(s.changePct).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <Clock />
    </div>
  )
}

// ─── SIDEBAR 
const Sidebar = ({ selected, onSelect, watchlist, onAdd, onRemove }) => {
  const [showAdd, setShowAdd] = useState(false)
  const notWatched = Object.keys(STOCKS).filter(s => !watchlist.includes(s))

  return (
    <div className="sidebar">

      {/* Market Indices */}
      <div className="sidebar-section">
        <div className="section-label">Market Indices</div>
        {INDICES.map(idx => (
          <div className="index-row" key={idx.name}>
            <span className="index-name">{idx.name}</span>
            <div className="index-right">
              <div className="index-value">{idx.value}</div>
              <div className={`index-change ${idx.up ? 'up' : 'dn'}`}>{idx.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Watchlist */}
      <div className="watchlist-body">
        <div className="section-label watchlist-label">
          <Eye size={9} /> Watchlist
        </div>

        <div className="watchlist-scroll">
          {watchlist.map(sym => {
            const s = STOCKS[sym]
            return (
              <div
                key={sym}
                className={`watchlist-item ${selected === sym ? 'active' : ''}`}
                onClick={() => onSelect(sym)}
              >
                <button className="wl-remove" onClick={e => { e.stopPropagation(); onRemove(sym) }}>
                  <X size={9} />
                </button>
                <div>
                  <div className="wl-symbol">{sym}</div>
                  <div className="wl-name">{s.name.split(' ')[0]}</div>
                </div>
                <div>
                  <div className="wl-price">${s.price.toFixed(2)}</div>
                  <div className={`wl-pct ${s.changePct >= 0 ? 'up' : 'dn'}`}>
                    {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add stock dropdown */}
        {showAdd && notWatched.length > 0 && (
          <div className="add-stock-list">
            {notWatched.map(sym => (
              <div key={sym} className="add-stock-option" onClick={() => { onAdd(sym); setShowAdd(false) }}>
                <span className="add-stock-sym">{sym}</span>
                <span className="add-stock-plus">+ Add</span>
              </div>
            ))}
          </div>
        )}

        <div className="add-stock-wrap">
          <button className="add-stock-btn" onClick={() => setShowAdd(v => !v)}>
            <Plus size={11} />
            {showAdd ? 'Cancel' : 'Add Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PRICE CHART 
const PriceChart = ({ stock }) => {
  const [range, setRange] = useState('1M')
  const ranges = { '1W': 7, '2W': 14, '1M': 30 }
  const data = stock.history.slice(-ranges[range])
  const isUp = data[data.length - 1]?.price >= data[0]?.price
  const color = isUp ? '#00e676' : '#ff3d5a'

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <span className="card-title"><BarChart2 size={10} /> Price Chart</span>
        <div className="range-tabs">
          {Object.keys(ranges).map(r => (
            <button key={r} className={`range-tab ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={190}>
        <AreaChart data={data} margin={{ top: 4, right: 2, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="price-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.22} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2a38" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#3a5f78', fontSize: 9, fontFamily: 'Space Mono' }}
            axisLine={false} tickLine={false}
            interval={Math.floor(data.length / 5)}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: '#3a5f78', fontSize: 9, fontFamily: 'Space Mono' }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `$${v}`}
            width={52}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="price" stroke={color} strokeWidth={1.5} fill="url(#price-grad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── VOLUME CHART ─────────────────────────────────────────────────────────────
const VolumeChart = ({ stock }) => (
  <div className="chart-card">
    <div className="chart-card-header">
      <span className="card-title"><BarChart2 size={10} /> Volume — 14 Days</span>
    </div>
    <ResponsiveContainer width="100%" height={90}>
      <BarChart data={stock.history.slice(-14)} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a2a38" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#3a5f78', fontSize: 9, fontFamily: 'Space Mono' }}
          axisLine={false} tickLine={false} interval={3}
        />
        <YAxis hide />
        <Bar dataKey="volume" fill="rgba(41,182,246,0.18)" stroke="rgba(41,182,246,0.4)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)

// ─── PORTFOLIO TABLE ─────────────────────────────────────────────────────────
const PortfolioTable = ({ onSelect }) => {
  const rows = PORTFOLIO.map(p => {
    const s = STOCKS[p.symbol]
    const val  = s.price * p.shares
    const cost = p.avgCost * p.shares
    const pnl  = val - cost
    return { ...p, s, val, cost, pnl, pnlPct: (pnl / cost) * 100 }
  })

  const totalVal  = rows.reduce((a, r) => a + r.val, 0)
  const totalCost = rows.reduce((a, r) => a + r.cost, 0)
  const totalPnl  = totalVal - totalCost
  const totalPct  = (totalPnl / totalCost) * 100

  const fmt = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="portfolio-card">
      <div className="portfolio-header">
        <span className="card-title"><Briefcase size={10} /> Portfolio</span>
        <span className="portfolio-count">{rows.length} positions</span>
      </div>

      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Shares</th>
            <th>Avg Cost</th>
            <th>Price</th>
            <th>Value</th>
            <th>P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.symbol} onClick={() => onSelect(r.symbol)}>
              <td>
                <div className="pt-symbol">{r.symbol}</div>
                <div className="pt-subname">{r.s.name.split(' ')[0]}</div>
              </td>
              <td style={{ color: 'var(--t1)' }}>{r.shares}</td>
              <td style={{ color: 'var(--t2)' }}>${r.avgCost.toFixed(2)}</td>
              <td style={{ color: 'var(--t1)' }}>${r.s.price.toFixed(2)}</td>
              <td style={{ color: 'var(--t1)' }}>${fmt(r.val)}</td>
              <td>
                <div style={{ color: r.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {r.pnl >= 0 ? '+' : ''}${r.pnl.toFixed(2)}
                </div>
                <div style={{ fontSize: 9, opacity: 0.8, color: r.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  ({r.pnlPct >= 0 ? '+' : ''}{r.pnlPct.toFixed(1)}%)
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="portfolio-footer">
        <div>
          <div className="footer-label">Total Value</div>
          <div className="footer-value">${fmt(totalVal)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="footer-label">Total P&amp;L</div>
          <div className="footer-value" style={{ color: totalPnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)} ({totalPct >= 0 ? '+' : ''}{totalPct.toFixed(2)}%)
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── NEWS PANEL ───────────────────────────────────────────────────────────────
const NewsPanel = () => (
  <div className="right-panel">
    <div className="right-panel-header">
      <div className="section-label"><Newspaper size={9} /> Market News</div>
    </div>
    <div className="news-scroll">
      {NEWS.map(n => (
        <div className="news-item" key={n.id}>
          <div className="news-top">
            <span className={`news-tag ${n.sentiment}`}>{n.tag}</span>
            <span className="news-time">{n.time}</span>
          </div>
          <div className="news-headline">{n.headline}</div>
          <div className="news-source">{n.source}</div>
        </div>
      ))}
    </div>
  </div>
)

// ─── APP (ROOT) ───────────────────────────────────────────────────────────────
export default function App() {
  const [selected, setSelected]   = useState('AAPL')
  const [watchlist, setWatchlist] = useState(['AAPL', 'NVDA', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'JPM'])

  const stock = STOCKS[selected]
  const isUp  = stock.changePct >= 0

  const handleAdd    = sym => setWatchlist(p => [...p, sym])
  const handleRemove = sym => {
    setWatchlist(p => p.filter(s => s !== sym))
    if (selected === sym) setSelected(watchlist.find(s => s !== sym) || 'AAPL')
  }

  return (
    <div className="app">
      <Topbar />

      <Sidebar
        selected={selected}
        onSelect={setSelected}
        watchlist={watchlist}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

      {/* Main Content */}
      <div className="main-content">

        {/* Stock Header */}
        <div className="stock-header" key={`hdr-${selected}`}>
          <div>
            <div className="stock-symbol">{stock.symbol}</div>
            <div className="stock-company">{stock.name}</div>
            <div className="stock-sector-tag">{stock.sector}</div>
            <div className="stock-meta-row">
              <div><div className="meta-label">Mkt Cap</div><div className="meta-value">{stock.marketCap}</div></div>
              <div><div className="meta-label">P/E</div><div className="meta-value">{stock.pe}</div></div>
              <div><div className="meta-label">Volume</div><div className="meta-value">{stock.volume}</div></div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="stock-price">${stock.price.toFixed(2)}</div>
            <div className={`stock-change-row ${isUp ? 'up' : 'dn'}`}>
              {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isUp ? '+' : ''}{stock.change.toFixed(2)} ({isUp ? '+' : ''}{stock.changePct.toFixed(2)}%)
            </div>
          </div>
        </div>

        <PriceChart  stock={stock} key={`price-${selected}`} />
        <VolumeChart stock={stock} key={`vol-${selected}`} />
        <PortfolioTable onSelect={setSelected} />
      </div>

      <NewsPanel />
    </div>
  )
}