import React from 'react';
import { useData } from '../hooks/useData';
import { Event } from '../types';
import { Calendar, Clock, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface EventListProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
}

export function EventList({ events, onEditEvent }: EventListProps) {
  const { deleteEvent, updateEvent } = useData();

  const handleDelete = (eventId: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю подію?')) {
      deleteEvent(eventId);
    }
  };

  const handleStatusChange = (event: Event, status: Event['status']) => {
    updateEvent(event.id, { status });
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Event['status']) => {
    switch (status) {
      case 'planned':
        return 'Заплановано';
      case 'completed':
        return 'Завершено';
      case 'cancelled':
        return 'Скасовано';
      default:
        return status;
    }
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Немає подій</h3>
        <p className="text-gray-500 mb-6">Створіть свою першу подію, щоб почати планування</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              {event.description && (
                <p className="text-gray-600 mb-3">{event.description}</p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(event.startTime), 'dd MMM yyyy', { locale: uk })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {format(new Date(event.startTime), 'HH:mm')} - {format(new Date(event.endTime), 'HH:mm')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {getStatusText(event.status)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex space-x-2">
              {event.status === 'planned' && (
                <>
                  <button
                    onClick={() => handleStatusChange(event, 'completed')}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Завершити</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(event, 'cancelled')}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Скасувати</span>
                  </button>
                </>
              )}
              {event.status !== 'planned' && (
                <button
                  onClick={() => handleStatusChange(event, 'planned')}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span>Перепланувати</span>
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onEditEvent(event)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}