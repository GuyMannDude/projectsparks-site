import React, { useState } from 'react';
import { TestResult } from '@/types/api';

interface TestResultsProps {
  result: TestResult;
  onBack: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ result, onBack }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <button
          onClick={onBack}
          className="text-cyan-400 hover:text-cyan-300 mb-8 flex items-center gap-2"
        >
          ← Back to Services
        </button>

        <div className="mb-8">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl mb-6 ${
            result.success 
              ? 'bg-green-500/20 border-4 border-green-500 shadow-lg shadow-green-500/50 animate-pulse' 
              : 'bg-red-500/20 border-4 border-red-500 shadow-lg shadow-red-500/50 animate-pulse'
          }`}>
            {result.success ? '✅' : '❌'}
          </div>
          
          <h2 className={`text-3xl font-bold mb-4 ${
            result.success ? 'text-green-400' : 'text-red-400'
          }`}>
            {result.success ? 'Your key is valid' : 'Your key is invalid'}
          </h2>
          
          <p className="text-gray-300 text-lg">
            {result.message}
          </p>
          
          {result.status && (
            <p className="text-gray-400 text-sm mt-2">
              Status: {result.status}
            </p>
          )}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-cyan-600 hover:bg-cyan-500 text-black font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 mb-6"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {showDetails && (
          <div className="bg-gray-900 border border-cyan-500 rounded-lg p-4 text-left max-h-64 overflow-y-auto">
            <pre className="text-sm text-cyan-300 whitespace-pre-wrap">
              {JSON.stringify(result.details, null, 2)}
            </pre>
          </div>
        )}

        <button
          onClick={onBack}
          className="mt-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300"
        >
          Test Another API
        </button>
      </div>
    </div>
  );
};

export default TestResults;