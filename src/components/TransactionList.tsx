import React from 'react';
import { useData } from '../hooks/useData';
import { Transaction } from '../types';
import { Wallet, Edit, Trash2, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface TransactionListProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onEditTransaction }: TransactionListProps) {
  const { deleteTransaction, categories, events } = useData();

  const handleDelete = (transactionId: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю транзакцію?')) {
      deleteTransaction(transactionId);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Невідомо';
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#6B7280';
  };

  const getEventTitle = (eventId?: string) => {
    if (!eventId) return null;
    return events.find(e => e.id === eventId)?.title;
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Немає транзакцій</h3>
        <p className="text-gray-500 mb-6">Додайте вашу першу транзакцію для відстеження фінансів</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Транзакції</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => {
          const categoryColor = getCategoryColor(transaction.categoryId);
          const relatedEvent = getEventTitle(transaction.relatedEventId);
          
          return (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: categoryColor }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-base font-medium text-gray-900 truncate">
                        {transaction.title}
                      </h4>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>{getCategoryName(transaction.categoryId)}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(transaction.date), 'dd MMM yyyy', { locale: uk })}</span>
                      </div>
                      {relatedEvent && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                            {relatedEvent}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 ml-4">
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₴{transaction.amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => onEditTransaction(transaction)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}