import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Event, EventStatus, FilterPeriod } from '../types';
import { EventForm } from './EventForm';
import { EventList } from './EventList';
import { Plus, Filter, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

export function EventManager() {
  const { getFilteredEvents } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('month');
  const [filterStatus, setFilterStatus] = useState<EventStatus>('all');
  const [filterDate, setFilterDate] = useState(new Date());

  const filteredEvents = getFilteredEvents(filterPeriod, filterDate, filterStatus);

  const statusCounts = {
    all: filteredEvents.length,
    planned: filteredEvents.filter(e => e.status === 'planned').length,
    completed: filteredEvents.filter(e => e.status === 'completed').length,
    cancelled: filteredEvents.filter(e => e.status === 'cancelled').length,
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Управління подіями</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Додати подію</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Період
            </label>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as FilterPeriod)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="day">День</option>
              <option value="week">Тиждень</option>
              <option value="month">Місяць</option>
              <option value="all">Всі</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Дата
            </label>
            <input
              type="date"
              value={format(filterDate, 'yyyy-MM-dd')}
              onChange={(e) => setFilterDate(new Date(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Статус
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as EventStatus)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Всі ({statusCounts.all})</option>
              <option value="planned">Заплановано ({statusCounts.planned})</option>
              <option value="completed">Завершено ({statusCounts.completed})</option>
              <option value="cancelled">Скасовано ({statusCounts.cancelled})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div 
          className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
            filterStatus === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setFilterStatus('all')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всього</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div 
          className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
            filterStatus === 'planned' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setFilterStatus('planned')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Заплановано</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.planned}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div 
          className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
            filterStatus === 'completed' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setFilterStatus('completed')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Завершено</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div 
          className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
            filterStatus === 'cancelled' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setFilterStatus('cancelled')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Скасовано</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Event List */}
      <EventList events={filteredEvents} onEditEvent={handleEditEvent} />

      {/* Event Form Modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}