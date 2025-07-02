import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Transaction } from '../types';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { uk } from 'date-fns/locale';

export function FinanceManager() {
  const { transactions, getMonthlyStats } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterMonth, setFilterMonth] = useState(new Date());
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const monthStats = getMonthlyStats(filterMonth);
  
  const filteredTransactions = transactions
    .filter(transaction => {
      const monthMatch = isWithinInterval(
        new Date(transaction.date),
        { start: startOfMonth(filterMonth), end: endOfMonth(filterMonth) }
      );
      const typeMatch = filterType === 'all' || transaction.type === filterType;
      return monthMatch && typeMatch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Фінансовий трекер</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Додати транзакцію</span>
        </button>
      </div>

      {/* Month Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Звіт за місяць</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <span className="text-lg font-medium text-gray-700 min-w-[140px] text-center">
              {format(filterMonth, 'LLLL yyyy', { locale: uk })}
            </span>
            <button
              onClick={() => setFilterMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Доходи</p>
                <p className="text-2xl font-bold text-green-700">
                  ₴{monthStats.totalIncome.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Витрати</p>
                <p className="text-2xl font-bold text-red-700">
                  ₴{monthStats.totalExpense.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Баланс</p>
                <p className={`text-2xl font-bold ${monthStats.balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                  ₴{monthStats.balance.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип транзакції
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Всі транзакції</option>
              <option value="income">Доходи</option>
              <option value="expense">Витрати</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <TransactionList 
        transactions={filteredTransactions} 
        onEditTransaction={handleEditTransaction}
      />

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}