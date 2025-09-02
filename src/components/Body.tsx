import React, { useState, useEffect, useRef, type FormEvent } from 'react';
import Button from './Button';
import TopTickersHelper from './TopTickersHelper';
import StockLineChart from './StockLineChart';
import StockReports from './StockReports';
import { useDispatch, useSelector } from 'react-redux';
import { addTicker, removeTicker, clearTicker } from '../store/slices/ticker';
import type { RootState } from '../types';
import useFetch from '../hooks/useFetch';
import { getDateBefore, getToday } from '../utils/dateUtils';

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

type StockReport = {
  ticker: string;
  estimated_increasing: boolean;
  estimated_change_percentage: number;
  confidence_level: 'Low' | 'Medium' | 'High';
  timeframe_days: number;
  short_summary: string;
  key_factors: string[];
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  market_sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  last_update: string;
};

type StockAnalysisData = {
  ticker: string;
  period_days: number;
  current_change: number;
  period_high: number;
  period_low: number;
  range: number;
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

const Body = () => {
  const [input, setInput] = useState<string>('');
  const [selected, setSelected] = useState<string>();
  const [ticketError, setTicketError] = useState<string>('');
  const [reports, setReports] = useState<StockReport[] | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [reportError, setReportError] = useState<string>('');
  const [timeRange, setTimeRange] = useState<number>(7); // For reports

  // Refs for smooth scrolling
  const chartRef = useRef<HTMLDivElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const tickets = useSelector((state: RootState) => state.ticker);
  const { data: stockData, get } = useFetch<Stock[]>(url, options);

  // Fetch stock data on component mount
  useEffect(() => {
    const fetchData = async () => {
      await get();
    };
    fetchData();
  }, [get]);

  // Clear reports when tickers change
  useEffect(() => {
    setReports(null);
    setReportError('');
  }, [tickets]);

  // Smooth scroll to chart when first ticker is added
  useEffect(() => {
    if (tickets.length === 1 && chartRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        chartRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [tickets.length]);

  // Smooth scroll to reports when they are generated
  useEffect(() => {
    if (reports && reports.length > 0 && reportsRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        reportsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [reports]);

  const calculateStockAnalysisData = (
    ticker: string,
    timeframeDays: number
  ): StockAnalysisData | null => {
    if (!stockData) return null;

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - timeframeDays);

    // Filter data for this ticker and timeframe
    const tickerData = stockData
      .filter((stock) => {
        const stockDate = new Date(stock.date);
        return (
          stock.ticker === ticker &&
          stockDate >= startDate &&
          stockDate <= today
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (tickerData.length === 0) return null;

    const firstPrice = tickerData[0].close_price;
    const lastPrice = tickerData[tickerData.length - 1].close_price;
    const currentChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Calculate highs and lows based on percentage change from first price
    const percentageChanges = tickerData.map(
      (stock) => ((stock.close_price - firstPrice) / firstPrice) * 100
    );

    const periodHigh = Math.max(...percentageChanges);
    const periodLow = Math.min(...percentageChanges);
    const range = periodHigh - periodLow;

    return {
      ticker,
      period_days: timeframeDays,
      current_change: Number(currentChange.toFixed(2)),
      period_high: Number(periodHigh.toFixed(2)),
      period_low: Number(periodLow.toFixed(2)),
      range: Number(range.toFixed(2)),
    };
  };

  const handleTickets = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) {
      setTicketError('Please enter a ticker symbol');
      return;
    }

    if (tickets.includes(input.toUpperCase())) {
      setTicketError('Ticker already added');
      return;
    }

    if (tickets.length < 3) {
      dispatch(addTicker(input.toUpperCase()));
      setInput('');
      setTicketError('');
    } else {
      setTicketError("You've reached the maximum of tickers");
    }
  };

  const handleSelect = (e: React.FocusEvent<HTMLInputElement>) => {
    setSelected(e.currentTarget.id);
    setTicketError('');
  };

  const handleRemoveTicker = (ticker: string) => {
    dispatch(removeTicker(ticker));
    setTicketError('');
  };

  const handleClearAll = () => {
    dispatch(clearTicker());
    setTicketError('');
  };

  const handleReport = async () => {
    if (tickets.length === 0 || !stockData) {
      setReportError('No tickers selected or data not loaded');
      return;
    }

    setIsGeneratingReport(true);
    setReportError('');

    try {
      // Calculate analysis data for each ticker
      const analysisData: StockAnalysisData[] = [];

      for (const ticker of tickets) {
        const data = calculateStockAnalysisData(ticker, timeRange);
        if (data) {
          analysisData.push(data);
        }
      }

      if (analysisData.length === 0) {
        setReportError('No data available for selected tickers and timeframe');
        setIsGeneratingReport(false);
        return;
      }

      // Prepare the system instruction
      const systemInstruction = `You are Vini's virtual assistant, a sharp and confident market analyst known for making bold, aggressive calls. You write for stock market beginners who want straight-talk analysis without confusing jargon. Your style is casual but authoritative - like a smart friend who actually knows their stuff.

CRITICAL RULES:
- ALWAYS respond with ONLY a valid JSON array of exactly ${analysisData.length} StockReport objects
- NO additional text, explanations, or commentary outside the JSON
- Use the EXACT structure provided in the schema below
- Be aggressive and confident in your predictions - no wishy-washy language
- Make bold percentage predictions - don't play it safe
- Use casual, engaging language that beginners can understand

CONFIDENCE LEVEL GUIDE:
- "High": Strong signals and clear direction (range > 10% OR current change > 5%)
- "Medium": Some signals but mixed (range 5-10% OR moderate current change)
- "Low": Limited movement or conflicting signals (range < 5%)

RECOMMENDATION GUIDE:
- "Strong Buy": High confidence + big upward prediction (>8%)
- "Buy": Medium-high confidence + solid upward prediction (3-8%)
- "Hold": Sideways movement expected or mixed signals
- "Sell": Expecting decline (3-8% down)
- "Strong Sell": High confidence + significant decline expected (>8% down)

KEY FACTORS should be 3-4 items mixing:
- Simple fundamental context (earnings, news, sector trends)
- Basic technical patterns (momentum, breakouts, support levels)
- Market activity (volume, institutional flow)
- Keep language simple but sound smart - avoid heavy jargon

RESPONSE SCHEMA (follow exactly):
[
  {
    "ticker": "string",
    "estimated_increasing": boolean,
    "estimated_change_percentage": number,
    "confidence_level": "Low" | "Medium" | "High",
    "timeframe_days": number,
    "short_summary": "string (1-2 casual sentences max)",
    "key_factors": ["string", "string", "string", "string"],
    "recommendation": "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell",
    "market_sentiment": "Bullish" | "Bearish" | "Neutral",
    "last_update": "string (ISO date)"
  }
]

Remember: Be aggressive, be confident, make bold calls. Beginners want conviction, not hedge words.`;

      // Prepare the prompt
      const prompt = `Analyze these stocks for the next ${timeRange} days and give me your most aggressive take. Make bold predictions based on this ${timeRange}-day performance data:

${JSON.stringify(analysisData, null, 2)}

Current date: ${new Date().toISOString().split('T')[0]}
Prediction timeframe: ${timeRange} days

Give me your most confident predictions. Don't hold back - be aggressive with your percentage estimates and recommendations. Focus on momentum, trends, and make calls that beginners will find exciting and actionable.

Respond with ONLY the JSON array - no other text.`;

      // Call your Supabase Edge Function
      const response = await fetch(
        'https://niihlyofonxtmzgzanpv.supabase.co/functions/v1/call-gemini',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5paWhseW9mb254dG16Z3phbnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjM4NjAsImV4cCI6MjA2MjI5OTg2MH0.GWWHIBQBDpNOvQiWZD_pRDDfOLG2u0DTV7JDcXlKndc',
          },

          body: JSON.stringify({
            systemInstruction,
            prompt,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      // Replace this section in your handleReport function:

      // The Gemini API returns the response in result.candidates[0].content.parts[0].text
      const reportText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reportText) {
        throw new Error('Invalid response format from AI');
      }

      // Parse the JSON response - FIXED VERSION
      let parsedReports: StockReport[];

      try {
        // Check if the response is wrapped in markdown code blocks
        if (reportText.includes('```json')) {
          // Extract JSON from markdown code blocks
          const jsonMatch = reportText.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            parsedReports = JSON.parse(jsonMatch[1].trim());
          } else {
            throw new Error('Could not extract JSON from markdown wrapper');
          }
        } else {
          // Try parsing directly if no markdown wrapper
          parsedReports = JSON.parse(reportText);
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw response text:', reportText);
        throw new Error('Failed to parse AI response as JSON');
      }

      if (
        !Array.isArray(parsedReports) ||
        parsedReports.length !== analysisData.length
      ) {
        throw new Error('Invalid report format received');
      }

      setReports(parsedReports);
    } catch (error) {
      console.error('Error generating reports:', error);
      setReportError('Report generation failed');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-black-gradient text-white font-sans px-4">
        <div className="glass-strong rounded-3xl p-10 w-full max-w-lg flex flex-col items-center gap-6 glow-subtle">
          {/* Title */}
          <div className="w-full flex items-center justify-between gap-2">
            <h2 className="h2">
              Add up to{' '}
              <span className="text-gradient-subtle">3 stock tickers</span>
            </h2>
            <TopTickersHelper setInput={setInput} />
          </div>

          {/* Input + button */}
          <form className="flex w-full" onSubmit={handleTickets}>
            <input
              className={`rounded-l-xl px-4 py-3 w-full outline-none transition-all duration-300 text-lg tracking-widest uppercase glass border-r-0
                ${
                  selected === 'ticker-input'
                    ? 'border-accent glow-white text-white'
                    : 'border-glass text-gray-300'
                }`}
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-backdrop)',
              }}
              onFocus={handleSelect}
              onBlur={() => setSelected('')}
              maxLength={4}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              type="text"
              value={input}
              placeholder="e.g. AAPL"
              id="ticker-input"
            />
            <Button
              type="submit"
              style={{
                borderRadius: 0,
                borderTopRightRadius: '12px',
                borderBottomRightRadius: '12px',
              }}
              size="lg"
              className="border-l-0"
            >
              +
            </Button>
          </form>
          {ticketError && (
            <p className="text-red-400 text-sm font-medium animate-pulse glow-subtle">
              {ticketError}
            </p>
          )}

          {/* Tickets list */}
          <div className="flex flex-col gap-3 w-full">
            {tickets.map((item, index) => (
              <div
                key={index}
                className="glass-strong rounded-xl px-4 py-3 text-left transition-all duration-300 flex justify-between items-center glass-hover group"
              >
                <span className="text-white font-semibold text-lg tracking-wide">
                  {item}
                </span>
                <button
                  onClick={() => handleRemoveTicker(item)}
                  className="text-red-400 hover:text-red-300 transition-all duration-200 ml-2 text-xl font-bold opacity-60 group-hover:opacity-100 hover:scale-110 cursor-pointer"
                  title="Remove ticker"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Timeframe Selector for Reports */}
            {tickets.length > 0 && (
              <div className="mt-4 p-4 glass rounded-xl border border-white/10">
                <label className="block text-color-300 text-sm font-medium mb-3">
                  Report Timeframe:
                </label>
                <div className="flex gap-2">
                  {[7, 14, 30].map((days) => (
                    <Button
                      key={days}
                      onClick={() => setTimeRange(days)}
                      size="sm"
                      variant={timeRange === days ? 'primary' : 'ghost'}
                      selected={timeRange === days}
                      className="flex-1 text-xs"
                    >
                      {days}d
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleReport}
                disabled={tickets.length === 0 || isGeneratingReport}
                className="flex-1 relative"
                size="lg"
              >
                {isGeneratingReport ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate AI Report'
                )}
              </Button>
              {tickets.length > 0 && (
                <Button
                  onClick={handleClearAll}
                  variant="secondary"
                  className="px-6"
                  size="lg"
                  disabled={isGeneratingReport}
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Report Error */}
            {reportError && (
              <div className="mt-4 p-4 glass-strong rounded-xl border border-red-500/20 bg-red-500/10">
                <p className="text-red-400 text-sm font-medium text-center">
                  {reportError}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="glass rounded-xl px-4 py-3 w-full text-center">
            <p className="text-sm text-gradient-subtle">
              You can add{' '}
              <span className="text-gradient-primary font-bold text-base">
                {3 - tickets.length}
              </span>{' '}
              more ticker(s).
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section with ref */}
      <div ref={chartRef}>
        <StockLineChart />
      </div>

      {/* AI Reports Section with ref */}
      {reports && reports.length > 0 && (
        <div ref={reportsRef}>
          <StockReports reports={reports} />
        </div>
      )}
    </>
  );
};

export default Body;
