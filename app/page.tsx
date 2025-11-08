'use client';

import { useState } from 'react';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleClientAdded = () => {
    // Trigger a refresh of the client list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-50 mb-2">
            Client Onboarding
          </h1>
          <p className="text-lg text-gray-600 dark:text-zinc-400">
            Manage your accounting firm's clients
          </p>
        </header>

        <div className="space-y-8">
          <ClientForm onClientAdded={handleClientAdded} />
          <ClientList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
