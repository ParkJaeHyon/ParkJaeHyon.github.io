import { ProjectType } from '../types/simulation';
import { projectConfigs } from '../utils/projectConfigs';
import * as LucideIcons from 'lucide-react';

interface ProjectTypeSelectorProps {
  value: ProjectType;
  onChange: (value: ProjectType) => void;
}

export function ProjectTypeSelector({ value, onChange }: ProjectTypeSelectorProps) {
  const getIcon = (type: ProjectType) => {
    switch (type) {
      case 'railway':
        return LucideIcons.Train;
      case 'building':
        return LucideIcons.Building2;
      case 'roadPaving':
        return LucideIcons.Construction;
      case 'agricultural':
        return LucideIcons.Droplets;
      case 'waterSupply':
        return LucideIcons.Droplets;
      case 'sewerage':
        return LucideIcons.Droplets;
      default:
        return LucideIcons.Circle;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {(Object.keys(projectConfigs) as ProjectType[]).map((type, index) => {
        const config = projectConfigs[type];
        const Icon = getIcon(type);
        const isSelected = value === type;
        
        if (!Icon) return null;
        
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`
              relative p-8 rounded-2xl border-2 transition-all duration-300
              hover:shadow-xl hover:scale-105 hover:-translate-y-1 text-left group
              ${isSelected 
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 elevation-lg shadow-blue-500/20' 
                : 'border-gray-200 bg-white elevation-sm hover:border-blue-300'
              }
            `}
          >
            {/* Number Badge */}
            {/* Removed number badge */}
            
            {isSelected && (
              <div className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 ${
              isSelected 
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/40' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
            }`}>
              <Icon className="size-7" />
            </div>
            
            <div className={`inline-block px-3 py-1 rounded-lg text-sm mb-3 font-medium transition-all duration-300 ${
              isSelected 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                : 'bg-gray-200 text-gray-700 group-hover:bg-blue-200 group-hover:text-blue-700'
            }`}>
              {index + 1}
            </div>
            
            <h3 className={`mb-2 text-lg font-semibold transition-colors ${
              isSelected ? 'text-blue-900' : 'text-gray-900'
            }`}>
              {config.name}
            </h3>
          </button>
        );
      })}
    </div>
  );
}