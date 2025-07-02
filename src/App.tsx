import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { EventManager } from './components/EventManager';
import { FinanceManager } from './components/FinanceManager';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <EventManager />;
      case 'finance':
        return <FinanceManager />;
      case 'settings':
        return (
          <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Налаштування</h2>
              <p className="text-gray-500">Налаштування будуть додані в майбутніх версіях</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pb-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;