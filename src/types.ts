export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: 'planned' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  date: Date;
  type: 'income' | 'expense';
  relatedEventId?: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: { [categoryId: string]: number };
}

export type FilterPeriod = 'day' | 'week' | 'month';
export type EventStatus = 'all' | 'planned' | 'completed' | 'cancelled';