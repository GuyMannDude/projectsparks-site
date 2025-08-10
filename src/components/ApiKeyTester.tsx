import React, { useState } from 'react';
import { ApiService, TestResult, Screen } from '@/types/api';
import ServiceSelection from './ServiceSelection';
import ApiTestForm from './ApiTestForm';
import TestResults from './TestResults';

const ApiKeyTester: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('selection');
  const [selectedService, setSelectedService] = useState<ApiService | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleServiceSelect = (service: ApiService) => {
    setSelectedService(service);
    setCurrentScreen('form');
  };

  const handleTestComplete = (result: TestResult) => {
    setTestResult(result);
    setCurrentScreen('results');
  };

  const handleBackToSelection = () => {
    setCurrentScreen('selection');
    setSelectedService(null);
    setTestResult(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {currentScreen === 'selection' && (
        <ServiceSelection onServiceSelect={handleServiceSelect} />
      )}
      
      {currentScreen === 'form' && selectedService && (
        <ApiTestForm
          service={selectedService}
          onBack={handleBackToSelection}
          onTestComplete={handleTestComplete}
        />
      )}
      
      {currentScreen === 'results' && testResult && (
        <TestResults
          result={testResult}
          onBack={handleBackToSelection}
        />
      )}
    </div>
  );
};

export default ApiKeyTester;