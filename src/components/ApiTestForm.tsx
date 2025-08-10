import React, { useState } from 'react';
import { ApiService, TestResult } from '@/types/api';

interface ApiTestFormProps {
  service: ApiService;
  onBack: () => void;
  onTestComplete: (result: TestResult) => void;
}

const ApiTestForm: React.FC<ApiTestFormProps> = ({ service, onBack, onTestComplete }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call - in real app, this would make actual requests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success/failure based on input length for demo
      const success = Object.values(formData).every(val => val.length > 10);
      
      onTestComplete({
        success,
        status: success ? 200 : 401,
        message: success ? 'API key is valid!' : 'Invalid API credentials',
        details: success ? { user: 'test@example.com' } : { error: 'Unauthorized' }
      });
    } catch (error) {
      onTestComplete({
        success: false,
        message: 'Network error occurred',
        details: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <button
          onClick={onBack}
          className="text-cyan-400 hover:text-cyan-300 mb-6 flex items-center gap-2"
        >
          ← Back to Services
        </button>
        
        <div className="bg-black border border-cyan-500 rounded-lg p-8 shadow-lg shadow-cyan-500/20">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{service.logo}</div>
            <h2 className="text-2xl font-bold text-cyan-400">{service.name}</h2>
            <p className="text-gray-300 mt-2">{service.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {service.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-cyan-300 text-sm font-medium mb-2">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
                </label>
                <input
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full bg-gray-900 border border-cyan-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-black hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105 animate-pulse hover:animate-none'
              }`}
            >
              {isLoading ? 'Testing...' : 'GO'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApiTestForm;