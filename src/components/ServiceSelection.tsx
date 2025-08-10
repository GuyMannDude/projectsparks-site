import React from 'react';
import { ApiService } from '@/types/api';
import { apiServices } from '@/data/apiServices';
import { extendedApiServices } from '@/data/apiServicesExtended';
import ApiServiceCard from './ApiServiceCard';

interface ServiceSelectionProps {
  onServiceSelect: (service: ApiService) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onServiceSelect }) => {
  const allServices = [...apiServices, ...extendedApiServices];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 animate-pulse">
            API Key Tester
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select an API service to test your credentials against their live endpoints
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allServices.map((service) => (
            <ApiServiceCard
              key={service.id}
              service={service}
              onSelect={onServiceSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;