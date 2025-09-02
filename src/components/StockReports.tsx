import React from 'react';

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

type StockReportsProps = {
  reports: StockReport[];
};

const StockReports: React.FC<StockReportsProps> = ({ reports }) => {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Buy':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Buy':
        return 'text-green-300 bg-green-300/10 border-green-300/20';
      case 'Hold':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Sell':
        return 'text-red-300 bg-red-300/10 border-red-300/20';
      case 'Strong Sell':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-color-300 bg-color-300/10 border-color-300/20';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return 'text-green-400 bg-green-400/10';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'Low':
        return 'text-orange-400 bg-orange-400/10';
      default:
        return 'text-color-300 bg-color-300/10';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish':
        return '🐂';
      case 'Bearish':
        return '🐻';
      case 'Neutral':
        return '⚖️';
      default:
        return '📊';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-pattern-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="h1 mb-3 text-gradient-primary">
            AI Stock Analysis Reports
          </h1>
          <p className="text-color-400 text-lg">
            Bold predictions powered by Vini's virtual assistant', your
            aggressive market analyst
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.ticker}
              className="glass-strong rounded-3xl border border-white/10 overflow-hidden glow-md hover:glow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/10 bg-gradient-glass">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-color-50">
                    {report.ticker}
                  </h3>
                  <span className="text-2xl">
                    {getSentimentIcon(report.market_sentiment)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getRecommendationColor(
                      report.recommendation
                    )}`}
                  >
                    {report.recommendation}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${getConfidenceColor(
                      report.confidence_level
                    )}`}
                  >
                    {report.confidence_level} Confidence
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6 space-y-6">
                {/* Price Prediction */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-color-300 text-sm font-medium">
                      {report.timeframe_days}-day prediction:
                    </span>
                    <span
                      className={`text-3xl ${
                        report.estimated_increasing ? '🟢' : '🔴'
                      }`}
                    >
                      {report.estimated_increasing ? '↗️' : '↘️'}
                    </span>
                  </div>
                  <div
                    className={`text-4xl font-bold ${
                      report.estimated_increasing
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {report.estimated_increasing ? '+' : '-'}
                    {report.estimated_change_percentage.toFixed(1)}%
                  </div>
                </div>

                {/* Summary */}
                <div className="glass rounded-xl p-4 border border-white/10">
                  <h4 className="text-color-50 font-semibold text-sm mb-2 uppercase tracking-wide">
                    Virtual Vini's take:
                  </h4>
                  <p className="text-color-200 text-sm leading-relaxed">
                    {report.short_summary}
                  </p>
                </div>

                {/* Key Factors */}
                <div>
                  <h4 className="text-color-50 font-semibold text-sm mb-3 uppercase tracking-wide">
                    Key Factors
                  </h4>
                  <div className="space-y-2">
                    {report.key_factors.map((factor, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-sm text-color-300"
                      >
                        <span className="text-color-500 font-bold text-xs mt-1">
                          {index + 1}.
                        </span>
                        <span className="leading-relaxed">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Sentiment */}
                <div className="flex items-center justify-between p-4 glass rounded-xl border border-white/10">
                  <span className="text-color-400 text-sm font-medium">
                    Market Sentiment:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getSentimentIcon(report.market_sentiment)}
                    </span>
                    <span
                      className={`font-semibold text-sm ${
                        report.market_sentiment === 'Bullish'
                          ? 'text-green-400'
                          : report.market_sentiment === 'Bearish'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {report.market_sentiment}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t border-white/10">
                  <p className="text-color-500 text-xs">
                    Generated based on last updated data:{' '}
                    {formatDate(report.last_update)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <div className="glass rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">🤖</span>
              <h3 className="text-color-50 font-semibold">
                AI-Powered Analysis
              </h3>
            </div>
            <p className="text-color-400 text-sm leading-relaxed">
              These predictions are generated by AI for educational and
              entertainment purposes only. Past performance doesn't guarantee
              future results. Always do your own research before making
              investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReports;
