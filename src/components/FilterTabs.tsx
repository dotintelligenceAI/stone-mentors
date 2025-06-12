
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mentor } from '../types/mentor';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  mentors: Mentor[];
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ 
  activeFilter, 
  onFilterChange, 
  mentors 
}) => {
  // Extract unique sectors from mentors
  const sectors = mentors.reduce((areas: { [key: string]: number }, mentor) => {
    const sector = mentor.setor;
    
    if (sector && mentor.disponivel) {
      areas[sector] = (areas[sector] || 0) + 1;
    }
    return areas;
  }, {});

  const allCount = mentors.filter(m => m.disponivel).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Filtrar por Setor
      </h2>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos os Mentores
          <Badge variant="secondary" className="ml-2">
            {allCount}
          </Badge>
        </button>
        
        {Object.entries(sectors).map(([sector, count]) => (
          <button
            key={sector}
            onClick={() => onFilterChange(sector)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === sector
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {sector}
            <Badge variant="secondary" className="ml-2">
              {count}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
};
