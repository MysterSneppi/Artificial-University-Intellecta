import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Institution } from '../../types';

interface InstitutionRankingProps {
  institutions: Institution[];
}

const InstitutionRanking: React.FC<InstitutionRankingProps> = ({ institutions }) => {
  // Sort institutions by rating
  const sortedInstitutions = [...institutions].sort((a, b) => b.rating - a.rating);
  
  // Generate trend indicators (in a real app, this would be based on historical data)
  const trends = ['up', 'same', 'down', 'up', 'down'];
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-heading font-semibold text-primary">Institution Rankings</h2>
      </div>
      
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institution
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Students
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedInstitutions.map((institution, index) => (
              <tr key={institution.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-white text-sm font-medium">
                      {institution.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{institution.name}</div>
                      <div className="text-xs text-gray-500">{institution.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{institution.rating.toFixed(1)}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{institution.studentCount}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {trends[index] === 'up' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      Up
                    </span>
                  )}
                  {trends[index] === 'down' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      Down
                    </span>
                  )}
                  {trends[index] === 'same' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      <Minus className="h-3 w-3 mr-1" />
                      Same
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstitutionRanking;