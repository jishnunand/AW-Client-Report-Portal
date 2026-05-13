import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientsAPI } from '../services/api';

export default function ClientList() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  // Fetch clients on component mount and when page changes
  useEffect(() => {
    fetchClients();
  }, [page]);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientsAPI.list(page * pageSize, pageSize);
      setClients(response.data);
    } catch (err) {
      setError('Failed to load clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientsAPI.delete(clientId);
        fetchClients(); // Refresh list
      } catch (err) {
        alert('Failed to delete client');
        console.error(err);
      }
    }
  };

  // Filter clients by search term
  const filteredClients = clients.filter(client =>
    client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.spouse_name && client.spouse_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
        <button
          onClick={() => navigate('/clients/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Client
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); // Reset to first page
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading clients...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredClients.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No clients match your search.' : 'No clients yet. Create one to get started!'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/clients/new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create First Client
            </button>
          )}
        </div>
      )}

      {/* Clients Table */}
      {!loading && filteredClients.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Spouse</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Monthly Salary</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Accounts</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {client.first_name}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {client.spouse_name || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    ${client.monthly_salary.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {client.accounts.length}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredClients.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page + 1}
          </span>
          <button
            disabled={filteredClients.length < pageSize}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
