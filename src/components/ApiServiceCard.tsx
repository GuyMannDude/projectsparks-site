import React from 'react';
import { ApiService } from '@/types/api';

interface ApiServiceCardProps {
  service: ApiService;
  onSelect: (service: ApiService) => void;
}

const ApiServiceCard: React.FC<ApiServiceCardProps> = ({ service, onSelect }) => {
  return (
    <div className="bg-black border border-cyan-500 rounded-lg p-6 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group">
      <div className="text-center">
        <div className="text-4xl mb-3">{service.logo}</div>
        <h3 className="text-xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors">
          {service.name}
        </h3>
        <p className="text-gray-300 text-sm mb-4 min-h-[40px]">
          {service.description}
        </p>
        <button
          onClick={() => onSelect(service)}
          className="bg-cyan-600 hover:bg-cyan-500 text-black font-semibold py-2 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105"
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default ApiServiceCard;