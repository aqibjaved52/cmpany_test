'use client';

import { useEffect, useState } from 'react';
import type { Client } from '@/types/database';

interface ClientListProps {
  refreshTrigger?: number;
}

export default function ClientList({ refreshTrigger }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/clients');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch clients');
      }

      setClients(data.clients || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-zinc-50">
          All Clients
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-zinc-400">Loading clients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-zinc-50">
          All Clients
        </h2>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50">
          All Clients
        </h2>
        <button
          onClick={fetchClients}
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Refresh
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-zinc-400">
            No clients found. Add your first client above!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Business Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Added On
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-zinc-50">
                    {client.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-zinc-400">
                    {client.email}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-zinc-400">
                    {client.business_name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-zinc-500">
                    {formatDate(client.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

