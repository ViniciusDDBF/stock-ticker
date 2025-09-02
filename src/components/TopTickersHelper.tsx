import { useState, useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';

interface TopTickersHelperProps {
  setInput: (ticker: string) => void;
}

const TopTickersHelper = ({ setInput }: TopTickersHelperProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const top10 = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'TSLA', name: 'Tesla Inc.' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corp.' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  ];

  // Close the dropdown when clicking outside
  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-400 hover:bg-amber-300 transition-colors text-slate-900 font-bold cursor-pointer"
      >
        ?
      </button>

      {open && (
        <div className="overflow-hidden absolute left-0 top-0 w-56 max-h-[320px] p-3 bg-gradient-primary text-white text-sm rounded-xl shadow-2xl z-10 ">
          <p className="font-semibold mb-2 text-center">
            Top 5 tickers (click to fill)
          </p>
          {top10.map((item) => (
            <div
              key={item.ticker}
              onClick={() => {
                setInput(item.ticker);
                setOpen(false);
              }}
              className="px-2 py-1 rounded hover:bg-500 cursor-pointer transition-colors whitespace-nowrap"
            >
              <span className="font-bold">{item.ticker}</span> - {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopTickersHelper;
