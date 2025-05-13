import React, { useState } from 'react';
import { Clock, Tag, Hash, Database } from 'lucide-react';
import { Block, Transaction } from '../../types';
import { format } from 'date-fns';

interface BlockchainInfoProps {
  blocks: Block[];
}

const BlockchainInfo: React.FC<BlockchainInfoProps> = ({ blocks }) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(blocks[0]);
  
  // Format transaction type for display
  const formatTransactionType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-heading font-semibold text-primary">Blockchain Explorer</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 h-[32rem]">
        {/* Block List */}
        <div className="md:col-span-1 border-r border-gray-200 overflow-y-auto h-full">
          <ul className="divide-y divide-gray-200">
            {blocks.map((block) => (
              <li key={block.id}>
                <button
                  onClick={() => setSelectedBlock(block)}
                  className={`w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors ${
                    selectedBlock?.id === block.id ? 'bg-primary bg-opacity-5' : ''
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                    <Hash size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Block #{block.id}</p>
                    <p className="text-xs text-gray-500">{format(new Date(block.timestamp), 'MMM d, HH:mm:ss')}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Block Details */}
        <div className="md:col-span-2 p-4 overflow-y-auto h-full">
          {selectedBlock && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Block #{selectedBlock.id}</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center text-sm">
                    <Clock size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {format(new Date(selectedBlock.timestamp), 'MMM d, yyyy HH:mm:ss')}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Tag size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-600">Hash: {selectedBlock.hash.substring(0, 14)}...</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Transactions ({selectedBlock.data.length})</h4>
                <div className="space-y-2">
                  {selectedBlock.data.map((transaction, index) => (
                    <div key={transaction.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <Database size={14} className="text-primary mr-2" />
                          <span className="text-xs font-medium text-gray-700">
                            {formatTransactionType(transaction.type)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(transaction.timestamp), 'HH:mm:ss')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        ID: {transaction.id.substring(0, 8)}... | Entity: {transaction.entityId}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Data: {JSON.stringify(transaction.data).substring(0, 30)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockchainInfo;