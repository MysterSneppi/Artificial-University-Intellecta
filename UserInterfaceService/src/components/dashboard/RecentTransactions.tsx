import React from 'react';
import { Transaction, TransactionType } from '../../types';
import { Clock, User, BookOpen, School, FileText } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  // Get the icon based on the transaction type
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.ENROLLMENT:
        return <User className="h-4 w-4 text-blue-500" />;
      case TransactionType.GRADE:
        return <FileText className="h-4 w-4 text-green-500" />;
      case TransactionType.COURSE_COMPLETION:
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case TransactionType.INSTITUTION_UPDATE:
        return <School className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Format transaction type for display
  const formatTransactionType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-heading font-semibold text-primary">Recent Transactions</h2>
      </div>
      
      <div className="p-3">
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="py-3 hover:bg-gray-50 transition-colors rounded-md px-2">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {formatTransactionType(transaction.type)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Entity: {transaction.entityId} | ID: {transaction.id.substring(0, 8)}...
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {format(new Date(transaction.timestamp), 'MMM d, HH:mm')}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentTransactions;