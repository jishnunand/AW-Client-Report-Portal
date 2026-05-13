import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientsAPI } from '../services/api';

export default function ClientForm({ isEdit: propIsEdit, onSuccess }) {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const isEdit = propIsEdit || !!clientId;

  const [formData, setFormData] = useState({
    first_name: '',
    spouse_name: '',
    dob: '',
    ssn_last4: '',
    marital_status: 'Single',
    monthly_salary: '',
    expense_budget: '',
    reserve_target: '',
    property_address: '',
    home_value: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch client data if editing
  useEffect(() => {
    if (isEdit && clientId) {
      fetchClient();
    }
  }, [isEdit, clientId]);

  const fetchClient = async () => {
    try {
      const response = await clientsAPI.get(clientId);
      const client = response.data;
      setFormData({
        first_name: client.first_name || '',
        spouse_name: client.spouse_name || '',
        dob: client.dob || '',
        ssn_last4: client.ssn_last4 || '',
        marital_status: client.marital_status || 'Single',
        monthly_salary: client.monthly_salary || '',
        expense_budget: client.expense_budget || '',
        reserve_target: client.reserve_target || '',
        property_address: client.property_address || '',
        home_value: client.home_value || ''
      });
    } catch (err) {
      console.error('Failed to fetch client', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (formData.monthly_salary && isNaN(formData.monthly_salary)) {
      newErrors.monthly_salary = 'Must be a number';
    }

    if (formData.monthly_salary < 0) {
      newErrors.monthly_salary = 'Cannot be negative';
    }

    if (formData.expense_budget && isNaN(formData.expense_budget)) {
      newErrors.expense_budget = 'Must be a number';
    }

    if (formData.ssn_last4 && formData.ssn_last4.length !== 4) {
      newErrors.ssn_last4 = 'Must be exactly 4 digits';
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
      // Convert string numbers to actual numbers
      const data = {
        ...formData,
        monthly_salary: parseFloat(formData.monthly_salary) || 0,
        expense_budget: parseFloat(formData.expense_budget) || 0,
        reserve_target: parseFloat(formData.reserve_target) || 0,
        home_value: parseFloat(formData.home_value) || 0
      };

      if (isEdit && clientId) {
        await clientsAPI.update(clientId, data);
      } else {
        await clientsAPI.create(data);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/clients');
      }
    } catch (err) {
      console.error('Failed to save client', err);
      alert('Failed to save client. Please try again.');
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
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Client' : 'New Client'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={inputClass('first_name')}
                placeholder="John"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>

            {/* Spouse Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spouse Name
              </label>
              <input
                type="text"
                name="spouse_name"
                value={formData.spouse_name}
                onChange={handleChange}
                className={inputClass('spouse_name')}
                placeholder="Jane"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={inputClass('dob')}
              />
            </div>

            {/* SSN Last 4 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SSN (Last 4 Digits)
              </label>
              <input
                type="text"
                name="ssn_last4"
                value={formData.ssn_last4}
                onChange={handleChange}
                className={inputClass('ssn_last4')}
                placeholder="1234"
                maxLength="4"
              />
              {errors.ssn_last4 && (
                <p className="text-red-500 text-sm mt-1">{errors.ssn_last4}</p>
              )}
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marital Status
              </label>
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                className={inputClass('marital_status')}
              >
                <option>Single</option>
                <option>Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Salary
              </label>
              <input
                type="number"
                name="monthly_salary"
                value={formData.monthly_salary}
                onChange={handleChange}
                className={inputClass('monthly_salary')}
                placeholder="15000"
                step="0.01"
              />
              {errors.monthly_salary && (
                <p className="text-red-500 text-sm mt-1">{errors.monthly_salary}</p>
              )}
            </div>

            {/* Monthly Expense Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Expense Budget
              </label>
              <input
                type="number"
                name="expense_budget"
                value={formData.expense_budget}
                onChange={handleChange}
                className={inputClass('expense_budget')}
                placeholder="10000"
                step="0.01"
              />
              {errors.expense_budget && (
                <p className="text-red-500 text-sm mt-1">{errors.expense_budget}</p>
              )}
            </div>

            {/* Private Reserve Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Private Reserve Target
              </label>
              <input
                type="number"
                name="reserve_target"
                value={formData.reserve_target}
                onChange={handleChange}
                className={inputClass('reserve_target')}
                placeholder="50000"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Property Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Property Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Address
              </label>
              <input
                type="text"
                name="property_address"
                value={formData.property_address}
                onChange={handleChange}
                className={inputClass('property_address')}
                placeholder="123 Main St, Springfield, IL 62701"
              />
            </div>

            {/* Home Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Home Value
              </label>
              <input
                type="number"
                name="home_value"
                value={formData.home_value}
                onChange={handleChange}
                className={inputClass('home_value')}
                placeholder="500000"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Client' : 'Create Client')}
          </button>
        </div>
      </form>
    </div>
  );
}
