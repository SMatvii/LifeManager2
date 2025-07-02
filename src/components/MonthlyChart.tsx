import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useData } from '../hooks/useData';
import { format, subMonths, startOfMonth } from 'date-fns';
import { uk } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyChartProps {
  currentMonth: Date;
}

export function MonthlyChart({ currentMonth }: MonthlyChartProps) {
  const { getMonthlyStats } = useData();

  const chartData = useMemo(() => {
    const months = [];
    const incomeData = [];
    const expenseData = [];

    // Get last 6 months including current
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(startOfMonth(currentMonth), i);
      const stats = getMonthlyStats(month);
      
      months.push(format(month, 'MMM', { locale: uk }));
      incomeData.push(stats.totalIncome);
      expenseData.push(stats.totalExpense);
    }

    return {
      labels: months,
      datasets: [
        {
          label: 'Доходи',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: 'Витрати',
          data: expenseData,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  }, [currentMonth, getMonthlyStats]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ₴${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value: any) => `₴${value.toLocaleString()}`,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}