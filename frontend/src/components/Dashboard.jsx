import { useState, useEffect } from 'react';
import { clientsAPI } from '../services/api';

export default function Dashboard({ onManageClients, onGenerateReport }) {
  const [stats, setStats] = useState({
    totalClients: 0,
    recentClients: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await clientsAPI.list(0, 5);
      setStats({
        totalClients: response.data.length,
        recentClients: response.data.slice(0, 5)
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to AW Portal</h1>
        <p className="text-lg text-gray-600">Manage client profiles and generate quarterly reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm uppercase font-semibold mb-2">Total Clients</p>
            <p className="text-4xl font-bold text-blue-600">{stats.totalClients}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm uppercase font-semibold mb-2">Reports Generated</p>
            <p className="text-4xl font-bold text-green-600">—</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm uppercase font-semibold mb-2">This Month</p>
            <p className="text-4xl font-bold text-purple-600">—</p>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Manage Clients */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Client Management</h2>
              <p className="text-blue-700 mb-4">
                Create, edit, and manage client profiles with complete financial information.
              </p>
              <button
                onClick={onManageClients}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Manage Clients
              </button>
            </div>
            <div className="text-5xl text-blue-200">👥</div>
          </div>
        </div>

        {/* Generate Reports */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">Generate Reports</h2>
              <p className="text-green-700 mb-4">
                Create quarterly SACS & TCC reports with automatic calculations and PDF export.
              </p>
              <button
                onClick={onGenerateReport}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                New Report
              </button>
            </div>
            <div className="text-5xl text-green-200">📊</div>
          </div>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Clients</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : stats.recentClients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No clients yet</p>
            <button
              onClick={onManageClients}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first client
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentClients.map(client => (
              <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <p className="font-semibold text-gray-900">{client.first_name}</p>
                  <p className="text-sm text-gray-500">
                    {client.accounts.length} account{client.accounts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={onManageClients}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feature Overview */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl mb-3">💾</div>
          <h3 className="font-semibold text-gray-900 mb-2">Client Profiles</h3>
          <p className="text-sm text-gray-600">
            Store and manage comprehensive client financial information securely.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl mb-3">🧮</div>
          <h3 className="font-semibold text-gray-900 mb-2">Auto Calculations</h3>
          <p className="text-sm text-gray-600">
            Automatic SACS & TCC calculations for accurate financial analysis.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl mb-3">📄</div>
          <h3 className="font-semibold text-gray-900 mb-2">PDF Reports</h3>
          <p className="text-sm text-gray-600">
            Generate professional PDF reports ready for client delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
