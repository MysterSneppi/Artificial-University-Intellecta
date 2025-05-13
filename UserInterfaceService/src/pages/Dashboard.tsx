import React, { useState } from 'react';
import ControlPanel from '../components/dashboard/ControlPanel';
import Statistics from '../components/dashboard/Statistics';
import BlockchainInfo from '../components/dashboard/BlockchainInfo';
import InstitutionRanking from '../components/dashboard/InstitutionRanking';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { 
  mockBlocks, 
  mockInstitutions, 
  mockStudents, 
  mockSimulationState,
  mockRecentTransactions
} from '../data/mockData';

const Dashboard: React.FC = () => {
  const [simulationState, setSimulationState] = useState(mockSimulationState);
  
  const handleStart = () => {
    setSimulationState({
      ...simulationState,
      isRunning: true
    });
  };
  
  const handlePause = () => {
    setSimulationState({
      ...simulationState,
      isRunning: false
    });
  };
  
  const handleReset = () => {
    setSimulationState({
      ...mockSimulationState,
      isRunning: false,
      currentBlock: 0,
      currentSemester: 1,
      elapsedTime: '00:00:00'
    });
  };
  
  const handleSpeedChange = (speed: number) => {
    setSimulationState({
      ...simulationState,
      speed
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold text-primary">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the Educational Blockchain Simulation System</p>
      </div>
      
      <ControlPanel 
        simulationState={simulationState}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onSpeedChange={handleSpeedChange}
      />
      
      <Statistics institutions={mockInstitutions} students={mockStudents} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BlockchainInfo blocks={mockBlocks} />
        <RecentTransactions transactions={mockRecentTransactions} />
      </div>
      
      <InstitutionRanking institutions={mockInstitutions} />
    </div>
  );
};

export default Dashboard;