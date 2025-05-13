import React, { useState } from 'react';
import { Student } from '../../types';

interface StudentPerformanceProps {
  students: Student[];
}

const StudentPerformance: React.FC<StudentPerformanceProps> = ({ students }) => {
  const [sortBy, setSortBy] = useState<'name' | 'performanceIndex'>('performanceIndex');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Sort students based on current sort settings
  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === 'asc'
        ? a.performanceIndex - b.performanceIndex
        : b.performanceIndex - a.performanceIndex;
    }
  });
  
  // Toggle sort order or change sort field
  const handleSort = (field: 'name' | 'performanceIndex') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-heading font-semibold text-primary">Student Performance</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Student
                  {sortBy === 'name' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institution
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grades
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('performanceIndex')}
              >
                <div className="flex items-center">
                  Performance
                  {sortBy === 'performanceIndex' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-white text-sm font-medium">
                      {student.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-500">ID: {student.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {/* In a real app, we would join with institutions data */}
                    {student.institutionId.replace('inst-', 'Institution ')}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {Object.entries(student.grades).map(([subject, grade]) => (
                      <div 
                        key={subject} 
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          grade >= 90 ? 'bg-green-100 text-green-800' :
                          grade >= 80 ? 'bg-blue-100 text-blue-800' :
                          grade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}: {grade}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className={`text-sm font-medium ${
                        student.performanceIndex >= 80 ? 'text-green-600' :
                        student.performanceIndex >= 70 ? 'text-blue-600' :
                        student.performanceIndex >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}
                    >
                      {student.performanceIndex}%
                    </div>
                    <div className="ml-2 w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          student.performanceIndex >= 80 ? 'bg-green-500' :
                          student.performanceIndex >= 70 ? 'bg-blue-500' :
                          student.performanceIndex >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${student.performanceIndex}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPerformance;