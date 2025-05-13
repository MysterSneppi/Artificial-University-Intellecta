import React from 'react';
import { TrendingUp, Users, School, BookOpen } from 'lucide-react';
import { Institution, Student } from '../../types';

interface StatisticsProps {
  institutions: Institution[];
  students: Student[];
}

const Statistics: React.FC<StatisticsProps> = ({ institutions, students }) => {
  // Calculate statistics
  const totalStudents = students.length;
  const totalInstitutions = institutions.length;
  const avgPerformance = students.reduce((sum, student) => sum + student.performanceIndex, 0) / totalStudents;
  const totalCourses = institutions.reduce((sum, inst) => sum + inst.courses, 0);
  
  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      change: '+5.2%',
      icon: <Users className="h-6 w-6 text-blue-500" />,
      trend: 'up',
    },
    {
      title: 'Institutions',
      value: totalInstitutions,
      change: '+2.1%',
      icon: <School className="h-6 w-6 text-purple-500" />,
      trend: 'up',
    },
    {
      title: 'Avg. Performance',
      value: `${avgPerformance.toFixed(1)}%`,
      change: '+3.7%',
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      trend: 'up',
    },
    {
      title: 'Total Courses',
      value: totalCourses,
      change: '+8.4%',
      icon: <BookOpen className="h-6 w-6 text-orange-500" />,
      trend: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{stat.value}</p>
            </div>
            <div className="p-2 rounded-md bg-gray-50">
              {stat.icon}
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <span 
              className={`text-xs font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.change}
            </span>
            <span className="ml-2 text-xs text-gray-500">since last semester</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;