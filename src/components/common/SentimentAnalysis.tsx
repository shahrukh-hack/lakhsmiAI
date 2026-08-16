import React from 'react';
import { StockPrediction } from '../../types';
import { Twitter, Youtube, SendIcon, BarChart } from 'lucide-react';
import Chart from 'react-apexcharts';

interface SentimentAnalysisProps {
  stock: StockPrediction;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ stock }) => {
  const { sentiment } = stock;
  
  const getSentimentEmoji = (score: number) => {
    if (score >= 0.7) return { emoji: '😊', text: 'Very Positive', color: 'text-green-600' };
    if (score >= 0.5) return { emoji: '🙂', text: 'Positive', color: 'text-green-500' };
    if (score >= 0.4) return { emoji: '😐', text: 'Neutral', color: 'text-gray-600' };
    if (score >= 0.2) return { emoji: '🙁', text: 'Negative', color: 'text-red-500' };
    return { emoji: '😡', text: 'Very Negative', color: 'text-red-600' };
  };
  
  const overallSentiment = getSentimentEmoji(sentiment.score);
  
  const chartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: {
        show: false
      }
    },
    colors: ['#6366F1', '#3B82F6', '#10B981'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 6
      },
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Twitter', 'YouTube', 'Telegram'],
    },
    yaxis: {
      min: 0,
      max: 1,
      labels: {
        formatter: (val: number) => {
          return (val * 100).toFixed(0) + '%';
        }
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          return (val * 100).toFixed(0) + '%';
        }
      }
    },
    legend: {
      show: false
    }
  };
  
  const chartSeries = [
    {
      name: 'Sentiment Score',
      data: [sentiment.twitter, sentiment.youtube, sentiment.telegram]
    }
  ];

  const platforms = [
    { 
      name: 'Twitter', 
      score: sentiment.twitter, 
      icon: <Twitter className="w-5 h-5 text-blue-400" />,
      sentiment: getSentimentEmoji(sentiment.twitter)
    },
    { 
      name: 'YouTube', 
      score: sentiment.youtube, 
      icon: <Youtube className="w-5 h-5 text-red-500" />,
      sentiment: getSentimentEmoji(sentiment.youtube)
    },
    { 
      name: 'Telegram', 
      score: sentiment.telegram, 
      icon: <SendIcon className="w-5 h-5 text-blue-500" />,
      sentiment: getSentimentEmoji(sentiment.telegram)
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <BarChart className="w-5 h-5 mr-2 text-blue-600" />
        Social Sentiment Analysis
      </h3>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <h4 className="text-sm text-gray-700 mb-2">Overall Sentiment</h4>
            <div className="text-5xl mb-2">{overallSentiment.emoji}</div>
            <div className={`font-bold ${overallSentiment.color}`}>
              {overallSentiment.text}
            </div>
            <div className="text-2xl font-bold mt-2">
              {(sentiment.score * 100).toFixed(0)}%
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {platforms.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center">
                  {platform.icon}
                  <span className="ml-2 text-sm">{platform.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg mr-2">{platform.sentiment.emoji}</span>
                  <span className={`text-sm font-bold ${platform.sentiment.color}`}>
                    {(platform.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:w-2/3">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;