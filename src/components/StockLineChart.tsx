import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import useFetch from '../hooks/useFetch';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';
import { getDateBefore, getToday } from '../utils/dateUtils';
import Button from './Button';

type Stock = {
  id: number;
  ticker: string;
  date: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
  adjusted_close: number | null;
  daily_change: number | null;
  daily_change_percent: number | null;
  created_at: string;
  updated_at: string;
};

type ChartDataPoint = {
  date: string;
  [key: string]: string | number | null;
};

const today = getToday();
const lastMonth = getDateBefore(today, 30);
const url = `https://niihlyofonxtmzgzanpv.supabase.co/rest/v1/stock_data?date=gte.${lastMonth}&date=lte.${today}`;

const options = {
  headers: {
    apikey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5paWhseW9mb254dG16Z3phbnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjM4NjAsImV4cCI6MjA2MjI5OTg2MH0.GWWHIBQBDpNOvQiWZD_pRDDfOLG2u0DTV7JDcXlKndc',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5paWhseW9mb254dG16Z3phbnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjM4NjAsImV4cCI6MjA2MjI5OTg2MH0.GWWHIBQBDpNOvQiWZD_pRDDfOLG2u0DTV7JDcXlKndc',
  },
};

// Vibrant, highly distinguishable colors for chart lines
const colors = [
  '#3b82f6', // bright blue
  '#ef4444', // bright red
  '#10b981', // emerald green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
  '#84cc16', // lime
  '#6366f1', // indigo
];

const StockLineChart = () => {
  const { data: stockData, get } = useFetch<Stock[]>(url, options);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const selectedTickers = useSelector((state: RootState) => state.ticker);
  const [timeRange, setTimeRange] = useState<number>(7); // days back from today
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // =====  FETCH INITIAL DATA  ===== \\
  useEffect(() => {
    const fetchData = async () => {
      await get();
    };
    fetchData();
  }, [get]);

  // =====  CALCULATE DATE RANGE BASED ON SELECTED DAYS  ===== \\
  useEffect(() => {
    const today = getToday();
    const lastXDays = getDateBefore(today, timeRange);
    setEndDate(today);
    setStartDate(lastXDays);
  }, [timeRange]);

  // =====  TRANSFORM DATA FOR CHART  ===== \\
  useEffect(() => {
    if (!stockData || selectedTickers.length === 0) {
      setChartData([]);
      return;
    }

    const start = getToday();
    const end = getDateBefore(today, timeRange);

    // Filter data by date range and selected tickers
    const filteredStocks = stockData.filter((item: Stock) => {
      return item.date <= start && item.date >= end;
    });

    // Get all unique dates in the range
    const allDates = [
      ...new Set(filteredStocks.map((stock: Stock) => stock.date)),
    ].sort();

    // Calculate percentage change from first available price for each ticker
    const baselinePrices: { [ticker: string]: number } = {};

    // Find the first available price for each ticker
    selectedTickers.forEach((ticker) => {
      const firstStock = filteredStocks
        .filter((stock) => stock.ticker === ticker)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )[0];
      if (firstStock) {
        baselinePrices[ticker] = firstStock.close_price;
      }
    });

    const transformedData: ChartDataPoint[] = allDates.map((date) => {
      const dataPoint: ChartDataPoint = { date };
      selectedTickers.forEach((ticker) => {
        const stockForDate = filteredStocks.find(
          (stock: Stock) => stock.date === date && stock.ticker === ticker
        );

        if (stockForDate && baselinePrices[ticker]) {
          // Calculate percentage change from baseline
          const percentChange =
            ((stockForDate.close_price - baselinePrices[ticker]) /
              baselinePrices[ticker]) *
            100;
          dataPoint[ticker] = Number(percentChange.toFixed(2));
        } else {
          dataPoint[ticker] = null;
        }
      });

      return dataPoint;
    });

    setChartData(transformedData);
  }, [stockData, selectedTickers, startDate, endDate]);

  // Custom tooltip using new design system
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-strong rounded-2xl p-4 shadow-xl border border-white/10">
          <p className="text-color-300 text-sm font-medium mb-3">
            {new Date(label).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => {
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full glow-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-color-50 font-semibold text-sm">
                    {entry.dataKey}
                  </span>
                </div>
                <span
                  className={`font-bold text-sm ${
                    entry.value >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {entry.value > 0 ? '+' : ''}
                  {entry.value}%
                </span>
              </div>;
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const formatYAxisTick = (value: number) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };

  const formatXAxisTick = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (!selectedTickers || selectedTickers.length === 0) {
    return (
      <div className="min-h-screen bg-pattern-primary flex items-center justify-center p-6">
        <div className="text-center glass rounded-3xl p-8 border border-white/10 max-w-md">
          <div className="bg-color-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center glow-sm">
            <svg
              className="w-10 h-10 text-color-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-color-50 font-semibold text-xl mb-2">
            No Tickers Selected
          </h3>
          <p className="text-color-400">
            Select at least one ticker from the sidebar to view the performance
            chart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="h1 mb-3 text-gradient-primary">
            Stock Performance Tracker
          </h1>
          <p className="text-color-400 text-lg">
            Track percentage changes across different time periods
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-2xl p-2 border border-white/10 glow-sm">
            <div className="flex gap-1">
              {[
                { value: 7, label: '7 days' },
                { value: 14, label: '14 days' },
                { value: 30, label: '30 days' },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  onClick={() => setTimeRange(value)}
                  size="md"
                  variant={timeRange === value ? 'primary' : 'ghost'}
                  selected={timeRange === value}
                  className="px-6 py-2.5 text-sm font-medium transition-all duration-200"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden glow-md">
          {/* Chart Header */}
          <div className="px-6 py-5 border-b border-white/10 bg-gradient-glass">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="h2 text-color-50">
                Performance Over Last {timeRange} Days
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                {selectedTickers.map((ticker, index) => (
                  <div key={ticker} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full glow-sm"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-color-300 font-medium text-sm">
                      {ticker}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Content */}
          <div className="p-6 bg-gradient-primary">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={500}>
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient
                      id="gridGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: '#64748b', stopOpacity: 0.2 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: '#64748b', stopOpacity: 0.05 }}
                      />
                    </linearGradient>
                    {/* Gradients for each line */}
                    {selectedTickers.map((ticker, index) => (
                      <linearGradient
                        key={ticker}
                        id={`gradient-${ticker}`}
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{
                            stopColor: colors[index % colors.length],
                            stopOpacity: 0.8,
                          }}
                        />
                        <stop
                          offset="100%"
                          style={{
                            stopColor: colors[index % colors.length],
                            stopOpacity: 0.1,
                          }}
                        />
                      </linearGradient>
                    ))}
                  </defs>

                  <CartesianGrid
                    strokeDasharray="2 4"
                    stroke="url(#gridGradient)"
                    strokeWidth={1}
                    horizontal={true}
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    tick={{ fill: '#cbd5e1', fontSize: 12 }}
                    tickFormatter={formatXAxisTick}
                    axisLine={{ stroke: '#64748b', strokeWidth: 1 }}
                    tickLine={{ stroke: '#64748b' }}
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    domain={[-15, 15]}
                    stroke="#94a3b8"
                    tick={{ fill: '#cbd5e1', fontSize: 12 }}
                    tickFormatter={formatYAxisTick}
                    axisLine={{ stroke: '#64748b', strokeWidth: 1 }}
                    tickLine={{ stroke: '#64748b' }}
                    label={{
                      value: 'Change (%)',
                      angle: -90,
                      position: 'insideLeft',
                      style: {
                        textAnchor: 'middle',
                        fill: '#cbd5e1',
                        fontSize: '14px',
                        fontWeight: '500',
                      },
                    }}
                  />

                  {/* Zero reference line */}
                  <Line
                    dataKey={() => 0}
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    dot={false}
                    legendType="none"
                    connectNulls={false}
                  />

                  <Tooltip
                    isAnimationActive={false}
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: '#94a3b8',
                      strokeWidth: 2,
                      strokeDasharray: '4 4',
                    }}
                  />

                  {selectedTickers.map((ticker, index) => (
                    <Line
                      key={ticker}
                      isAnimationActive={false}
                      dot={false}
                      activeDot={{
                        r: 8,
                        fill: colors[index % colors.length],
                        stroke: '#f8fafc',
                        strokeWidth: 3,
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
                      }}
                      type="monotone"
                      dataKey={ticker}
                      stroke={colors[index % colors.length]}
                      strokeWidth={4}
                      name={ticker}
                      connectNulls={false}
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center">
                <div className="bg-color-500/10 rounded-full p-6 mb-6 glow-sm">
                  <svg
                    className="w-16 h-16 text-color-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-color-50 font-semibold text-xl mb-3">
                  No Data Available
                </h3>
                <p className="text-color-400 max-w-md leading-relaxed">
                  No data available for the selected time range and tickers. Try
                  adjusting your selection or check back later.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {chartData.length > 0 && selectedTickers.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedTickers.map((ticker, index) => {
              const latestData = chartData[chartData.length - 1];
              const currentChange = (latestData?.[ticker] as number) || 0;

              // Find highest and lowest points
              const tickerValues = chartData
                .map((d) => d[ticker] as number)
                .filter((v) => v !== null && v !== undefined);

              const highestPoint = Math.max(...tickerValues);
              const lowestPoint = Math.min(...tickerValues);

              return (
                <div
                  key={ticker}
                  className="glass rounded-2xl p-6 border border-white/10 hover:border-white/15 transition-all duration-200 hover:glass-strong glow-sm hover:glow-md"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-4 h-4 rounded-full glow-sm"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <h3 className="text-color-50 font-bold text-lg">
                      {ticker}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-color-400 text-sm font-medium">
                        Current Change:
                      </span>
                      <span
                        className={`font-bold text-lg ${
                          currentChange >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {currentChange > 0 ? '+' : ''}
                        {currentChange.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-color-400 text-sm font-medium">
                        Period High:
                      </span>
                      <span className="text-green-400 font-semibold">
                        +{highestPoint.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-color-400 text-sm font-medium">
                        Period Low:
                      </span>
                      <span className="text-red-400 font-semibold">
                        {lowestPoint.toFixed(2)}%
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-color-400 text-sm font-medium">
                          Range:
                        </span>
                        <span className="text-color-50 font-semibold">
                          {(highestPoint - lowestPoint).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockLineChart;
