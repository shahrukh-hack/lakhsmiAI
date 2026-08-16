import React, { useState } from 'react';
import { StockPrediction } from '../../types';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface PaperTradeFormProps {
  stock: StockPrediction;
  onSubmit: (type: 'buy' | 'sell', quantity: number, price: number) => void;
  disabled?: boolean;
}

const PaperTradeForm: React.FC<PaperTradeFormProps> = ({ stock, onSubmit, disabled = false }) => {
  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(stock.price);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(type, quantity, price);
  };
  
  const calculateTotal = () => {
    return (quantity * price).toFixed(2);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
        Paper Trading - {stock.symbol}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex space-x-2 mb-2">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
                type === 'buy'
                  ? 'bg-green-100 text-green-700 border-2 border-green-500'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
              onClick={() => setType('buy')}
              disabled={disabled}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Buy</span>
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
                type === 'sell'
                  ? 'bg-red-100 text-red-700 border-2 border-red-500'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
              onClick={() => setType('sell')}
              disabled={disabled}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Sell</span>
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Price (₹)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            step="0.01"
            min="0"
            disabled={disabled}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="1"
            disabled={disabled}
          />
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between text-sm">
            <span>Total Value:</span>
            <span className="font-bold">₹{calculateTotal()}</span>
          </div>
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            type === 'buy' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'
          } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={disabled || quantity < 1}
        >
          {type === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}
        </button>
      </form>
    </div>
  );
};

export default PaperTradeForm;