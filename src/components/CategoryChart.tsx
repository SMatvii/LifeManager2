import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useData } from '../hooks/useData';
import { MonthlyStats } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  stats: MonthlyStats;
}

export function CategoryChart({ stats }: CategoryChartProps) {
  const { categories } = useData();

  const chartData = useMemo(() => {
    const categoryData = Object.entries(stats.categoryBreakdown)
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          name: category?.name || 'Невідомо',
          amount,
          color: category?.color || '#6B7280',
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8); // Show top 8 categories

    return {
      labels: categoryData.map(item => item.name),
      datasets: [
        {
          data: categoryData.map(item => item.amount),
          backgroundColor: categoryData.map(item => item.color),
          borderColor: categoryData.map(item => item.color),
          borderWidth: 2,
          hoverBorderWidth: 3,
        },
      ],
    };
  }, [stats.categoryBreakdown, categories]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                return {
                  text: `${label}: ₴${value.toLocaleString()}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: data.datasets[0].borderWidth,
                  pointStyle: 'circle',
                };
              });
            }
            return [];
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
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ₴${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  if (Object.keys(stats.categoryBreakdown).length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Немає даних для відображення
      </div>
    );
  }

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}