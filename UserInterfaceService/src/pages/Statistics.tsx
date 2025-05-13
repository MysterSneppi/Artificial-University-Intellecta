import React, { useEffect, useState } from 'react';
import { 
  mockPerformanceData, 
  mockInstitutionComparisonData, 
  mockTransactionsPerDay
} from '../data/mockData';

const Statistics: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // This is a placeholder for when we would actually import and use Chart.js
    // In a real implementation, we would render the charts here using the data
    console.log('Charts would be rendered here with the following data:');
    console.log('Performance Data:', mockPerformanceData);
    console.log('Institution Comparison:', mockInstitutionComparisonData);
    console.log('Transactions Per Day:', mockTransactionsPerDay);
  }, []);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold text-primary">Statistics</h1>
        <p className="text-gray-600 mt-1">View detailed analytics and metrics from the blockchain simulation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-heading font-semibold text-primary mb-4">Performance Trends</h2>
          {isClient ? (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Chart.js would render here in a real implementation</p>
                <p className="text-sm text-gray-400">Showing student performance and institution ratings over time</p>
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gray-100 animate-pulse"></div>
          )}
          <div className="mt-4 text-sm text-gray-600">
            <p>This chart shows the average student performance and institution ratings over the last 6 months.</p>
          </div>
        </div>
        
        {/* Institution Comparison */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-heading font-semibold text-primary mb-4">Institution Comparison</h2>
          {isClient ? (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Chart.js would render here in a real implementation</p>
                <p className="text-sm text-gray-400">Comparing key metrics across institutions</p>
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gray-100 animate-pulse"></div>
          )}
          <div className="mt-4 text-sm text-gray-600">
            <p>This chart compares different institutions based on student satisfaction, course completion rates, and other metrics.</p>
          </div>
        </div>
        
        {/* Transactions Per Day */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-heading font-semibold text-primary mb-4">Transactions Per Day</h2>
          {isClient ? (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Chart.js would render here in a real implementation</p>
                <p className="text-sm text-gray-400">Showing daily transaction volume</p>
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gray-100 animate-pulse"></div>
          )}
          <div className="mt-4 text-sm text-gray-600">
            <p>This chart shows the number of blockchain transactions processed each day over the past week.</p>
          </div>
        </div>
        
        {/* Key Statistics */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-heading font-semibold text-primary mb-4">Key Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-md p-3">
              <div className="text-sm text-gray-500">Total Students</div>
              <div className="text-xl font-medium text-primary">1,248</div>
              <div className="text-xs text-green-600 mt-1">+5.2% from last semester</div>
            </div>
            <div className="border border-gray-200 rounded-md p-3">
              <div className="text-sm text-gray-500">Average GPA</div>
              <div className="text-xl font-medium text-primary">3.47</div>
              <div className="text-xs text-green-600 mt-1">+0.14 from last semester</div>
            </div>
            <div className="border border-gray-200 rounded-md p-3">
              <div className="text-sm text-gray-500">Course Completion</div>
              <div className="text-xl font-medium text-primary">89.3%</div>
              <div className="text-xs text-green-600 mt-1">+2.1% from last semester</div>
            </div>
            <div className="border border-gray-200 rounded-md p-3">
              <div className="text-sm text-gray-500">Blockchain Size</div>
              <div className="text-xl font-medium text-primary">24.8 MB</div>
              <div className="text-xs text-gray-600 mt-1">125 blocks</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>These statistics represent the current state of the educational blockchain system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;