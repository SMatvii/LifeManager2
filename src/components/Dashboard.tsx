import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { MonthlyChart } from './MonthlyChart';
import { CategoryChart } from './CategoryChart';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { uk } from 'date-fns/locale';

export function Dashboard() {
  const { getMonthlyStats, events, transactions } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const stats = getMonthlyStats(currentMonth);
  const previousMonthStats = getMonthlyStats(subMonths(currentMonth, 1));
  
  const incomeChange = stats.totalIncome - previousMonthStats.totalIncome;
  const expenseChange = stats.totalExpense - previousMonthStats.totalExpense;
  
  const upcomingEvents = events
    .filter(event => event.status === 'planned' && new Date(event.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Панель управління</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <span className="text-lg font-medium text-gray-700 min-w-[140px] text-center">
            {format(currentMonth, 'LLLL yyyy', { locale: uk })}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Доходи</p>
              <p className="text-2xl font-bold text-green-600">
                ₴{stats.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {incomeChange >= 0 ? '↗' : '↘'} ₴{Math.abs(incomeChange).toLocaleString()}
            </span>
            <span className="text-gray-500 ml-2">від минулого місяця</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Витрати</p>
              <p className="text-2xl font-bold text-red-600">
                ₴{stats.totalExpense.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`${expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {expenseChange <= 0 ? '↘' : '↗'} ₴{Math.abs(expenseChange).toLocaleString()}
            </span>
            <span className="text-gray-500 ml-2">від минулого місяця</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Баланс</p>
              <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ₴{stats.balance.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((stats.totalIncome / (stats.totalIncome + stats.totalExpense)) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Динаміка за рік</h3>
          <MonthlyChart currentMonth={currentMonth} />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Витрати за категоріями</h3>
          <CategoryChart stats={stats} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Найближчі події
          </h3>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.startTime), 'dd MMM, HH:mm', { locale: uk })}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                    event.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.status === 'planned' ? 'Заплановано' :
                     event.status === 'completed' ? 'Завершено' : 'Скасовано'}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Немає запланованих подій</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Останні транзакції
          </h3>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.date), 'dd MMM yyyy', { locale: uk })}
                    </p>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₴{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Немає транзакцій</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}