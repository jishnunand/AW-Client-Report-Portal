import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { accountsAPI } from '../services/api';

export default function AccountForm() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    account_type: '401K',
    institution: '',
    account_name: '',
    interest_rate: '0'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const accountTypes = [
    'IRA',
    'Roth IRA',
    '401K',
    'Roth 401K',
    'Pension',
    'Brokerage',
    'Joint Account',
    'Savings',
    'Money Market',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution name is required';
    }

    if (!formData.account_name.trim()) {
      newErrors.account_name = 'Account name is required';
    }

    if (formData.interest_rate && isNaN(formData.interest_rate)) {
      newErrors.interest_rate = 'Must be a number';
    }

    if (formData.interest_rate < 0 || formData.interest_rate > 100) {
      newErrors.interest_rate = 'Must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        interest_rate: parseFloat(formData.interest_rate) || 0
      };

      await accountsAPI.create(clientId, data);
      navigate(`/clients/${clientId}`);
    } catch (err) {
      console.error('Failed to save account', err);
      alert('Failed to save account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName) => `
    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}
  `;

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Add Account</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type *
          </label>
          <select
            name="account_type"
            value={formData.account_type}
            onChange={handleChange}
            className={inputClass('account_type')}
          >
            {accountTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Institution */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution *
          </label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            className={inputClass('institution')}
            placeholder="e.g., Fidelity, Vanguard, Charles Schwab"
          />
          {errors.institution && (
            <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
          )}
        </div>

        {/* Account Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Name *
          </label>
          <input
            type="text"
            name="account_name"
            value={formData.account_name}
            onChange={handleChange}
            className={inputClass('account_name')}
            placeholder="e.g., John's Roth 401K, Joint Brokerage"
          />
          {errors.account_name && (
            <p className="text-red-500 text-sm mt-1">{errors.account_name}</p>
          )}
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate (%)
          </label>
          <input
            type="number"
            name="interest_rate"
            value={formData.interest_rate}
            onChange={handleChange}
            className={inputClass('interest_rate')}
            placeholder="0"
            step="0.01"
            min="0"
            max="100"
          />
          {errors.interest_rate && (
            <p className="text-red-500 text-sm mt-1">{errors.interest_rate}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate(`/clients/${clientId}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Adding...' : 'Add Account'}
          </button>
        </div>
      </form>
    </div>
  );
}
