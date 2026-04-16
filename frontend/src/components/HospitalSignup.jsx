import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const HospitalSignup = () => {
  const [formData, setFormData] = useState({
    hospitalName: '',
    hospitalEmail: '',
    hospitalPhone: '',
    licenseNumber: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.adminPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/hospital/register`, {
        hospitalName: formData.hospitalName,
        hospitalEmail: formData.hospitalEmail,
        hospitalPhone: formData.hospitalPhone,
        licenseNumber: formData.licenseNumber,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword
      });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-white">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hospital Registration</h1>
          <p className="text-gray-600">Register your hospital and create admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hospital Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Hospital Information</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="hospitalName"
                placeholder="Hospital Name"
                value={formData.hospitalName}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="email"
                name="hospitalEmail"
                placeholder="Hospital Email"
                value={formData.hospitalEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="tel"
                name="hospitalPhone"
                placeholder="Hospital Phone"
                value={formData.hospitalPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                name="licenseNumber"
                placeholder="Hospital License Number"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Admin Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Admin Account</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="adminName"
                placeholder="Admin Name"
                value={formData.adminName}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="email"
                name="adminEmail"
                placeholder="Admin Email"
                value={formData.adminEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="password"
                name="adminPassword"
                placeholder="Password"
                value={formData.adminPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
                minLength="6"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Hospital'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              ❌ {error}
            </div>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already registered? <Link to="/login" className="text-purple-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default HospitalSignup;
