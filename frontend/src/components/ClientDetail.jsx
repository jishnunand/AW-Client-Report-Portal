import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientsAPI, accountsAPI } from '../services/api';

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const fetchClientData = async () => {
    setLoading(true);
    setError(null);
    try {
      const clientResponse = await clientsAPI.get(clientId);
      setClient(clientResponse.data);

      const accountsResponse = await accountsAPI.list(clientId);
      setAccounts(accountsResponse.data);
    } catch (err) {
      setError('Failed to load client details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountsAPI.delete(accountId);
        setAccounts(accounts.filter(a => a.id !== accountId));
      } catch (err) {
        alert('Failed to delete account');
        console.error(err);
      }
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatCurrency = (value) => {
    return `$${parseFloat(value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading client details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <button
          onClick={onBack}
          className="ml-4 underline font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  const age = calculateAge(client.dob);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/clients')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {client.first_name} {client.spouse_name ? `& ${client.spouse_name}` : ''}
          </h1>
        </div>
        <button
          onClick={() => navigate(`/clients/${client.id}/edit`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Edit
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</p>
                <p className="text-sm text-gray-900">
                  {client.dob ? `${client.dob}${age ? ` (${age} years old)` : ''}` : '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Marital Status</p>
                <p className="text-sm text-gray-900">{client.marital_status || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">SSN (Last 4)</p>
                <p className="text-sm text-gray-900">{client.ssn_last4 || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Property Address</p>
                <p className="text-sm text-gray-900">{client.property_address || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Financial Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase">Monthly Salary</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(client.monthly_salary)}
                </p>
              </div>

              <div className="bg-orange-50 rounded p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase">Monthly Expenses</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(client.expense_budget)}
                </p>
              </div>

              <div className="bg-green-50 rounded p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase">Private Reserve Target</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(client.reserve_target)}
                </p>
              </div>

              <div className="bg-purple-50 rounded p-4 md:col-span-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">Home Value</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(client.home_value)}
                </p>
              </div>
            </div>

            {/* SACS Calculation */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">SACS Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Inflow</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(client.monthly_salary)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Outflow</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(client.expense_budget)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Excess</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(client.monthly_salary - client.expense_budget)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Accounts Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Financial Accounts</h2>
              <button
                onClick={() => navigate(`/clients/${client.id}/accounts/new`)}
                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
              >
                + Add Account
              </button>
            </div>

            {accounts.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded">
                <p className="text-gray-500 mb-4">No accounts added yet</p>
                <button
                  onClick={() => alert('Add account feature coming soon')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Add First Account
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Institution</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Account Name</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Interest Rate</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map(account => (
                      <tr key={account.id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {account.account_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{account.institution}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{account.account_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {account.interest_rate ? `${account.interest_rate}%` : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleDeleteAccount(account.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Generate Report Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Generate Quarterly Report</h2>
            <p className="text-gray-600 mb-4">
              Create a new quarterly report with the current financial information.
            </p>
            <button
              onClick={() => alert('Generate report feature coming in next phase')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Generate Q2 2026 Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
