import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Rewind, FastForward, Hash } from 'lucide-react';
import { SimulationState } from '../../types';

interface ControlPanelProps {
  simulationState: SimulationState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  simulationState,
  onStart,
  onPause,
  onReset,
  onSpeedChange
}) => {
  const { isRunning, currentBlock, currentSemester, speed, elapsedTime } = simulationState;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-primary">Simulation Control</h2>
        <div className="flex items-center space-x-2">
          <div className="text-xs px-2 py-1 bg-primary bg-opacity-10 rounded-full text-primary font-medium flex items-center">
            <Hash size={14} className="mr-1" />
            Block: {currentBlock}
          </div>
          <div className="text-xs px-2 py-1 bg-success bg-opacity-10 rounded-full text-success-dark font-medium">
            Semester: {currentSemester}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          {!isRunning ? (
            <button 
              onClick={onStart}
              className="bg-success text-white p-2 rounded-md hover:bg-success-dark transition-colors"
            >
              <Play size={20} />
            </button>
          ) : (
            <button 
              onClick={onPause}
              className="bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              <Pause size={20} />
            </button>
          )}
          
          <button 
            onClick={onReset}
            className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            <RefreshCw size={20} />
          </button>
          
          <div className="bg-gray-100 rounded-md flex items-center">
            <button 
              onClick={() => onSpeedChange(Math.max(0.5, speed - 0.5))}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              disabled={speed <= 0.5}
            >
              <Rewind size={18} />
            </button>
            <span className="px-2 font-medium text-sm text-gray-700">{speed}x</span>
            <button 
              onClick={() => onSpeedChange(Math.min(3, speed + 0.5))}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              disabled={speed >= 3}
            >
              <FastForward size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="text-sm text-gray-500 mr-2">Elapsed Time:</div>
            <div className="font-medium text-primary">{elapsedTime}</div>
          </div>
          
          <div className="h-8 w-1 bg-gray-200 rounded-full"></div>
          
          <div className={`flex items-center ${isRunning ? 'text-success' : 'text-gray-500'}`}>
            <div className={`h-2 w-2 rounded-full mr-2 ${isRunning ? 'bg-success animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium">{isRunning ? 'Running' : 'Paused'}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-secondary h-2.5 rounded-full" 
            style={{width: `${(currentSemester / 8) * 100}%`}}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Semester 1</span>
          <span>Semester 4</span>
          <span>Semester 8</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;