import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricProps {
  title: string;
  value: string | number;
  change: number;
  previousValue?: string | number;
}

const SimulationMetrics: React.FC = () => {
  const metrics: MetricProps[] = [
    {
      title: 'Student Enrollment',
      value: 1234,
      change: 5.2,
      previousValue: 1173,
    },
    {
      title: 'Average Grade',
      value: '82.7%',
      change: 1.8,
      previousValue: '81.2%',
    },
    {
      title: 'Course Completion',
      value: '73.4%',
      change: -2.1,
      previousValue: '75.0%',
    },
    {
      title: 'Transactions/Day',
      value: 856,
      change: 12.3,
      previousValue: 762,
    },
    {
      title: 'Institution Rating',
      value: '4.32',
      change: 0.0,
      previousValue: '4.32',
    },
    {
      title: 'Blockchain Size',
      value: '24.8 MB',
      change: 8.7,
      previousValue: '22.8 MB',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-heading font-semibold text-primary mb-4">Simulation Metrics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-3 hover:border-secondary transition-colors">
            <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
            
            <div className="mt-2 flex items-baseline">
              <p className="text-xl font-semibold text-gray-900">{metric.value}</p>
              
              <div 
                className={`ml-2 flex items-center text-xs font-medium ${
                  metric.change > 0 
                    ? 'text-green-600' 
                    : metric.change < 0 
                      ? 'text-red-600' 
                      : 'text-gray-500'
                }`}
              >
                {metric.change > 0 && (
                  <>
                    <ArrowUpRight size={14} className="mr-0.5" />
                    +{metric.change}%
                  </>
                )}
                {metric.change < 0 && (
                  <>
                    <ArrowDownRight size={14} className="mr-0.5" />
                    {metric.change}%
                  </>
                )}
                {metric.change === 0 && (
                  <>
                    <Minus size={14} className="mr-0.5" />
                    {metric.change}%
                  </>
                )}
              </div>
            </div>
            
            <p className="mt-1 text-xs text-gray-500">
              Previous: {metric.previousValue}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulationMetrics;