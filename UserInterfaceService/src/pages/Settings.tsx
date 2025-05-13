import React, { useState } from 'react';
import { Save, ArrowRight } from 'lucide-react';

const Settings: React.FC = () => {
  const [simulationSettings, setSimulationSettings] = useState({
    simulationSpeed: 1,
    blockGenerationTime: 60,
    difficultyLevel: 4,
    dataSource: 'synthetic',
    enableRealTimeUpdates: true,
    showNotifications: true,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setSimulationSettings({
      ...simulationSettings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save these settings to a backend or local storage
    alert('Settings saved successfully!');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold text-primary">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your blockchain simulation environment</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-heading font-semibold text-primary">Simulation Settings</h2>
              <p className="text-sm text-gray-500 mt-1">
                Configure how the blockchain simulation runs and processes data
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="simulationSpeed" className="block text-sm font-medium text-gray-700 mb-1">
                  Simulation Speed
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id="simulationSpeed"
                    name="simulationSpeed"
                    min="0.5"
                    max="3"
                    step="0.5"
                    value={simulationSettings.simulationSpeed}
                    onChange={handleInputChange}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">{simulationSettings.simulationSpeed}x</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Controls how fast the simulation runs compared to real-time
                </p>
              </div>
              
              <div>
                <label htmlFor="blockGenerationTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Block Generation Time (seconds)
                </label>
                <input
                  type="number"
                  id="blockGenerationTime"
                  name="blockGenerationTime"
                  value={simulationSettings.blockGenerationTime}
                  onChange={handleInputChange}
                  min="10"
                  max="300"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  The average time between new blocks being created
                </p>
              </div>
              
              <div>
                <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Mining Difficulty Level
                </label>
                <select
                  id="difficultyLevel"
                  name="difficultyLevel"
                  value={simulationSettings.difficultyLevel}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm"
                >
                  <option value="2">Easy (2)</option>
                  <option value="4">Medium (4)</option>
                  <option value="6">Hard (6)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Difficulty level affects block generation time and security
                </p>
              </div>
              
              <div>
                <label htmlFor="dataSource" className="block text-sm font-medium text-gray-700 mb-1">
                  Data Source
                </label>
                <select
                  id="dataSource"
                  name="dataSource"
                  value={simulationSettings.dataSource}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm"
                >
                  <option value="synthetic">Synthetic Data</option>
                  <option value="historical">Historical Data</option>
                  <option value="live">Live Data (Beta)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Source of data for the simulation to process
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-base font-medium text-gray-700">Display Preferences</h3>
              
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="enableRealTimeUpdates"
                    name="enableRealTimeUpdates"
                    type="checkbox"
                    checked={simulationSettings.enableRealTimeUpdates}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="enableRealTimeUpdates" className="ml-2 block text-sm text-gray-700">
                    Enable real-time updates
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="showNotifications"
                    name="showNotifications"
                    type="checkbox"
                    checked={simulationSettings.showNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="showNotifications" className="ml-2 block text-sm text-gray-700">
                    Show notifications for important events
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md transition-colors flex items-center"
              >
                <Save size={16} className="mr-1.5" />
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-heading font-semibold text-primary">Export Data</h2>
            <p className="text-sm text-gray-500 mt-1">
              Export simulation data for analysis or backup purposes
            </p>
          </div>
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-dark rounded-md transition-colors flex items-center"
          >
            Export
            <ArrowRight size={16} className="ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;