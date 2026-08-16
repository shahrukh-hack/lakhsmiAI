import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { CandlestickData } from '../../types';
import { BarChart3, TrendingUp } from 'lucide-react';
import { sound } from '../../lib/sound';

interface StockChartProps {
  symbol: string;
  candlesticks: CandlestickData[];
  historicalPrices: Array<{ date: string; price: number }>;
  isBullish: boolean;
}

export const StockChart: React.FC<StockChartProps> = ({ 
  candlesticks, 
  historicalPrices,
  isBullish 
}) => {
  const [chartType, setChartType] = useState<'candlestick' | 'area'>('candlestick');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');

  // Candlestick chart options
  const candleOptions: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 380,
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 500,
      }
    },
    theme: {
      mode: 'dark',
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
      strokeDashArray: 3,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: 'category',
      labels: {
        style: {
          colors: '#94A3B8',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
        },
      },
      axisBorder: { color: 'rgba(255, 255, 255, 0.1)' },
      axisTicks: { color: 'rgba(255, 255, 255, 0.1)' },
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: {
        formatter: (val) => `₹${val.toFixed(1)}`,
        style: {
          colors: '#94A3B8',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
        },
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#10B981',
          downward: '#EF4444',
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'JetBrains Mono, monospace',
      },
    },
  };

  // Area chart options
  const areaOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 380,
      background: 'transparent',
      toolbar: { show: true },
    },
    theme: { mode: 'dark' },
    colors: [isBullish ? '#10B981' : '#EF4444'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2.5,
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
      strokeDashArray: 3,
    },
    xaxis: {
      categories: historicalPrices.map(p => p.date),
      labels: {
        style: {
          colors: '#94A3B8',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `₹${val.toFixed(1)}`,
        style: {
          colors: '#94A3B8',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
        },
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'JetBrains Mono, monospace',
      },
    },
  };

  const candleSeries = [
    {
      name: 'Candles',
      data: candlesticks || [],
    },
  ];

  const areaSeries = [
    {
      name: 'Price',
      data: historicalPrices.map(p => p.price),
    },
  ];

  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-tactile-sm">
      {/* Chart Toolbar Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-surface-subtle border border-border">
            <button
              onClick={() => {
                sound.playClick();
                setChartType('candlestick');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                chartType === 'candlestick'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Candles</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setChartType('area');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                chartType === 'area'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Area Line</span>
            </button>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-subtle border border-border text-xs font-mono">
          {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => {
                sound.playClick();
                setTimeframe(tf);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                timeframe === tf
                  ? 'bg-card text-foreground font-bold border border-border shadow-tactile-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full">
        {chartType === 'candlestick' ? (
          <Chart
            options={candleOptions}
            series={candleSeries}
            type="candlestick"
            height={380}
          />
        ) : (
          <Chart
            options={areaOptions}
            series={areaSeries}
            type="area"
            height={380}
          />
        )}
      </div>
    </div>
  );
};

export default StockChart;