import React from 'react';
import { Block } from '../../types';
import { ChevronRight, Database, Shield } from 'lucide-react';

interface BlockchainVisualizationProps {
  blocks: Block[];
}

const BlockchainVisualization: React.FC<BlockchainVisualizationProps> = ({ blocks }) => {
  const displayedBlocks = blocks.slice(0, 5); // Just display a few blocks for visual clarity
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-heading font-semibold text-primary mb-4">Blockchain Visualization</h2>
      
      <div className="overflow-x-auto">
        <div className="flex items-center space-x-2 py-2">
          {displayedBlocks.map((block, index) => (
            <React.Fragment key={block.id}>
              <div className={`
                p-3 rounded-md flex flex-col justify-between min-w-[160px] h-32
                border-2 border-primary bg-primary bg-opacity-5 transition-all duration-300
                hover:shadow-lg hover:border-secondary
              `}>
                <div className="flex justify-between items-start">
                  <div className="bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
                    #{block.id}
                  </div>
                  <Shield size={16} className="text-gray-400" />
                </div>
                
                <div className="mt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <Database size={12} className="mr-1" />
                    Transactions: {block.data.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Hash: {block.hash.substring(0, 8)}...
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="text-xs text-gray-500">
                    Nonce: {block.nonce}
                  </div>
                </div>
              </div>
              
              {index < displayedBlocks.length - 1 && (
                <div className="text-gray-400">
                  <ChevronRight size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="mt-4 border-t border-gray-200 pt-3">
        <div className="text-sm text-gray-600">
          <strong>Total Blocks:</strong> {blocks.length} | 
          <strong className="ml-2">Latest Block:</strong> #{blocks[0].id} | 
          <strong className="ml-2">Difficulty:</strong> {blocks[0].difficulty}
        </div>
      </div>
    </div>
  );
};

export default BlockchainVisualization;