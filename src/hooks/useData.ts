import { useState, useMemo } from 'react';
import { Event, Transaction, Category, MonthlyStats } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { defaultCategories } from '../data/categories';
import { 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval, 
  startOfWeek, 
  endOfWeek, 
  startOfDay, 
  endOfDay 
} from 'date-fns';

export function useData() {
  const [events, setEvents] = useLocalStorage<Event[]>('lifemanager-events', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('lifemanager-transactions', []);
  const [categories] = useLocalStorage<Category[]>('lifemanager-categories', defaultCategories);

  // Generate ID
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Events
  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: generateId(),
      createdAt: new Date(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  // Transactions
  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === id ? { ...transaction, ...updates } : transaction
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  // Statistics
  const getMonthlyStats = (date: Date): MonthlyStats => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthTransactions = transactions.filter(transaction => 
      isWithinInterval(new Date(transaction.date), { start: monthStart, end: monthEnd })
    );

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
        return acc;
      }, {} as { [categoryId: string]: number });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown
    };
  };

  const getFilteredEvents = (period: 'day' | 'week' | 'month' | 'all', date: Date, status: string) => {
    let dateRange: { start: Date; end: Date } | null = null;

    if (period === 'day') {
      dateRange = { start: startOfDay(date), end: endOfDay(date) };
    } else if (period === 'week') {
      dateRange = { start: startOfWeek(date, { weekStartsOn: 1 }), end: endOfWeek(date, { weekStartsOn: 1 }) };
    } else if (period === 'month') {
      dateRange = { start: startOfMonth(date), end: endOfMonth(date) };
    }

    return events.filter(event => {
      const statusMatch = status === 'all' || event.status === status;
      const dateMatch = !dateRange || isWithinInterval(new Date(event.startTime), dateRange);
      return statusMatch && dateMatch;
    });
  };

  return {
    events,
    transactions,
    categories,
    addEvent,
    updateEvent,
    deleteEvent,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyStats,
    getFilteredEvents
  };
}