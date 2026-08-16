import React from 'react';
import { StockPrediction } from '../../types';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface TechnicalIndicatorsProps {
  stock: StockPrediction;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ stock }) => {
  const { signals } = stock;

  const getRSIStatus = (rsi: number) => {
    if (rsi >= 70) return { text: 'Overbought', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (rsi <= 30) return { text: 'Oversold', color: 'text-green-600', bgColor: 'bg-green-100' };
    return { text: 'Neutral', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const rsiStatus = getRSIStatus(signals.rsi);

  const indicators = [
    {
      name: 'RSI',
      value: signals.rsi,
      status: rsiStatus.text,
      color: rsiStatus.color,
      bgColor: rsiStatus.bgColor,
      description: 'Relative Strength Index'
    },
    {
      name: 'MACD',
      value: signals.macd === 'positive' ? 'Bullish' : 'Bearish',
      status: signals.macd,
      color: signals.macd === 'positive' ? 'text-green-600' : 'text-red-600',
      bgColor: signals.macd === 'positive' ? 'bg-green-100' : 'bg-red-100',
      description: 'Moving Average Convergence Divergence'
    },
    {
      name: 'Bollinger',
      value: signals.bollinger.charAt(0).toUpperCase() + signals.bollinger.slice(1),
      status: signals.bollinger,
      color: signals.bollinger === 'upper' ? 'text-green-600' : 
             signals.bollinger === 'lower' ? 'text-red-600' : 'text-gray-600',
      bgColor: signals.bollinger === 'upper' ? 'bg-green-100' : 
               signals.bollinger === 'lower' ? 'bg-red-100' : 'bg-gray-100',
      description: 'Bollinger Bands'
    },
    {
      name: 'EMA',
      value: signals.ema === 'above' ? 'Above' : 'Below',
      status: signals.ema,
      color: signals.ema === 'above' ? 'text-green-600' : 'text-red-600',
      bgColor: signals.ema === 'above' ? 'bg-green-100' : 'bg-red-100',
      description: 'Exponential Moving Average'
    },
    {
      name: 'SMA',
      value: signals.sma === 'above' ? 'Above' : 'Below',
      status: signals.sma,
      color: signals.sma === 'above' ? 'text-green-600' : 'text-red-600',
      bgColor: signals.sma === 'above' ? 'bg-green-100' : 'bg-red-100',
      description: 'Simple Moving Average'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-blue-600" />
        Technical Indicators
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map((indicator) => (
          <div key={indicator.name} className="border rounded-md p-3 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">{indicator.description}</span>
              <span className={`text-xs font-medium py-1 px-2 rounded-full ${indicator.bgColor} ${indicator.color}`}>
                {indicator.name}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-bold">{indicator.value}</span>
              {indicator.status === 'positive' || indicator.status === 'above' || indicator.status === 'upper' || indicator.status === 'Oversold' ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : indicator.status === 'negative' || indicator.status === 'below' || indicator.status === 'lower' || indicator.status === 'Overbought' ? (
                <TrendingDown className="w-5 h-5 text-red-600" />
              ) : (
                <Activity className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalIndicators;