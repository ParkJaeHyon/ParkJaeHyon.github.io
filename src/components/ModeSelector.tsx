import { AnalysisMode } from '../types/simulation';
import { TrendingUp, Users, Shield } from 'lucide-react';

interface ModeSelectorProps {
  value: AnalysisMode;
  onChange: (value: AnalysisMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const modes = [
    {
      value: 1,
      icon: TrendingUp,
      title: 'Mode 1',
      subtitle: 'Efficiency Threshold Simulation',
      description: 'Explore the minimum efficiency and investment ratio required for the technology to be economically viable',
      color: 'blue'
    },
    {
      value: 2,
      icon: Users,
      title: 'Mode 2',
      subtitle: 'Feasibility Analysis for Safety Robots',
      description: 'Analyze the combined effects of labor reduction and accident prevention from deploying safety robots',
      color: 'green'
    },
    {
      value: 3,
      icon: Shield,
      title: 'Mode 3',
      subtitle: 'Worker-Level Safety Tech Analysis',
      description: 'Simulate the economic benefits of deploying personal safety devices based on adoption rate and cost per worker',
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = value === mode.value;
        
        return (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value as AnalysisMode)}
            className={`
              relative p-8 rounded-2xl border-2 transition-all duration-300
              hover:shadow-2xl hover:scale-105 hover:-translate-y-2 text-left group
              ${isSelected 
                ? mode.color === 'blue' 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 elevation-xl shadow-blue-500/30' 
                  : mode.color === 'green' 
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 elevation-xl shadow-emerald-500/30' 
                  : 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 elevation-xl shadow-purple-500/30'
                : 'border-gray-200 bg-white elevation-md hover:border-blue-300'
              }
            `}
          >
            {/* Selection Indicator */}
            {isSelected && (
              <div className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300 ${
                mode.color === 'blue' 
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                  : mode.color === 'green' 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {/* Icon */}
            <div className={`w-18 h-18 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
              isSelected 
                ? mode.color === 'blue' 
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/50' 
                  : mode.color === 'green' 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/50' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/50'
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
            }`}>
              <Icon className="size-9" />
            </div>
            
            {/* Mode Badge */}
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm mb-4 font-semibold transition-all duration-300 ${
              isSelected 
                ? mode.color === 'blue' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                  : mode.color === 'green' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 group-hover:bg-blue-200 group-hover:text-blue-700'
            }`}>
              {mode.title}
            </div>
            
            {/* Title */}
            <h3 className={`mb-3 text-lg font-semibold leading-snug transition-colors ${
              isSelected ? 'text-gray-900' : 'text-gray-900'
            }`}>
              {mode.subtitle}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {mode.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}