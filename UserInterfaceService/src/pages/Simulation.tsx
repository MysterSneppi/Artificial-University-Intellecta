import React, { useState } from 'react';
import { Play, Pause, RefreshCw, BarChart2, List } from 'lucide-react';
import BlockchainVisualization from '../components/simulation/BlockchainVisualization';
import SimulationMetrics from '../components/simulation/SimulationMetrics';
import StudentPerformance from '../components/simulation/StudentPerformance';
import { mockBlocks, mockStudents, mockSimulationState } from '../data/mockData';

const Simulation: React.FC = () => {
  const [simulationState, setSimulationState] = useState(mockSimulationState);
  const [activeView, setActiveView] = useState<'metrics' | 'students'>('metrics');
  
  const toggleSimulation = () => {
    setSimulationState(prev => ({
      ...prev,
      isRunning: !prev.isRunning
    }));
  };
  
  const resetSimulation = () => {
    setSimulationState({
      ...mockSimulationState,
      isRunning: false,
      currentBlock: 0,
      currentSemester: 1,
      elapsedTime: '00:00:00'
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold text-primary">Simulation</h1>
        <p className="text-gray-600 mt-1">Control and visualize the educational blockchain simulation</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <button
              onClick={toggleSimulation}
              className={`p-2 rounded-md text-white ${
                simulationState.isRunning ? 'bg-primary' : 'bg-success'
              }`}
            >
              {simulationState.isRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button
              onClick={resetSimulation}
              className="p-2 rounded-md bg-gray-200 text-gray-700"
            >
              <RefreshCw size={20} />
            </button>
            
            <div className="text-sm font-medium ml-2">
              {simulationState.isRunning ? 'Simulation Running' : 'Simulation Paused'}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-md p-1 flex">
              <button
                onClick={() => setActiveView('metrics')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  activeView === 'metrics' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                <div className="flex items-center">
                  <BarChart2 size={16} className="mr-1.5" />
                  Metrics
                </div>
              </button>
              
              <button
                onClick={() => setActiveView('students')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  activeView === 'students' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                <div className="flex items-center">
                  <List size={16} className="mr-1.5" />
                  Students
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-md p-3">
              <div className="text-xs text-gray-500">Current Block</div>
              <div className="text-lg font-medium">{simulationState.currentBlock}</div>
            </div>
            <div className="border border-gray-200 rounded-md p-3">
              <div className="text-xs text-gray-500">Current Semester</div>
              <div className="text-lg font-medium">{simulationState.currentSemester}/8</div>
            </div>
            <div className="border border-gray-200 rounded-md p-3">
              <div className="text-xs text-gray-500">Simulation Speed</div>
              <div className="text-lg font-medium">{simulationState.speed}x</div>
            </div>
            <div className="border border-gray-200 rounded-md p-3">
              <div className="text-xs text-gray-500">Elapsed Time</div>
              <div className="text-lg font-medium">{simulationState.elapsedTime}</div>
            </div>
          </div>
        </div>
      </div>
      
      <BlockchainVisualization blocks={mockBlocks} />
      
      {activeView === 'metrics' && <SimulationMetrics />}
      {activeView === 'students' && <StudentPerformance students={mockStudents} />}
    </div>
  );
};

export default Simulation;