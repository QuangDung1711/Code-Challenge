import { useEffect, useMemo, useState } from "react";

// ===== Types =====
interface PriceItem {
  currency: string;
  date: string;
  price: number;
}

type PriceMap = Record<string, number>;

// ===== Constants =====
const PRICE_URL = "https://interview.switcheo.com/prices.json";
const ICON_BASE =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

const ICON_MAP: Record<string, string> = {
  bNEO: "NEO",
  axlUSDC: "USDC",
  ampLUNA: "LUNA",
  wstETH: "ETH",
};

// ===== Helpers =====
function normalizePrices(data: PriceItem[]): PriceMap {
  const map: Record<string, { date: string; price: number }> = {};

  data.forEach((item) => {
    if (
      !map[item.currency] ||
      new Date(item.date) > new Date(map[item.currency].date)
    ) {
      map[item.currency] = { date: item.date, price: item.price };
    }
  });

  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.price]));
}

export default function App() {
  const [prices, setPrices] = useState<PriceMap>({});
  const [from, setFrom] = useState<string>("ETH");
  const [to, setTo] = useState<string>("USDC");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch prices
  useEffect(() => {
    fetch(PRICE_URL)
      .then((res) => res.json())
      .then((data: PriceItem[]) => {
        setPrices(normalizePrices(data));
      });
  }, []);

  const currencies = useMemo(() => Object.keys(prices), [prices]);

  // Calculate output
  const outputAmount = useMemo(() => {
    if (!amount) return "0";
    const fromPrice = prices[from];
    const toPrice = prices[to];
    if (!fromPrice || !toPrice) return "0";

    return ((Number(amount) * fromPrice) / toPrice).toFixed(6);
  }, [amount, from, to, prices]);

  const handleSwap = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    if (from === to) {
      setError("Cannot swap the same currency");
      return;
    }

    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);

    alert(`Swapped ${amount} ${from} → ${outputAmount} ${to}`);
  };

  const fromIcon = ICON_MAP[from] ?? from;
  const toIcon = ICON_MAP[to] ?? to;

  return (
    <div className="container">
      <div className="card">
        <h2>Currency Swap</h2>

        <div className="field">
          <label>From</label>
          <div className="row">
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <img
              src={`${ICON_BASE}/${fromIcon}.svg`}
              onError={(e) => {
                e.currentTarget.src = `${ICON_BASE}/SWTH.svg`;
              }}
            />
          </div>
        </div>

        <div className="field">
          <label>To</label>
          <div className="row">
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input disabled value={outputAmount} />
            <img
              src={`${ICON_BASE}/${toIcon}.svg`}
              onError={(e) => {
                e.currentTarget.src = `${ICON_BASE}/SWTH.svg`;
              }}
            />
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button onClick={handleSwap} disabled={loading}>
          {loading ? "Swapping…" : "Swap"}
        </button>
      </div>
    </div>
  );
}
