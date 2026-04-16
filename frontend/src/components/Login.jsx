import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'doctor') {
        navigate('/doctor');
      } else if (user.role === 'patient') {
        navigate('/patient');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center mb-8 hover:opacity-80 transition">
            <img 
              src="/images/logo-full.png" 
              alt="Chikitsa" 
              className="h-16 object-contain"
            />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Chikitsa account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-600 focus:outline-none transition"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-600 focus:outline-none transition"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start">
                <span className="mr-2">❌</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue as</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Link
              to="/signup/hospital"
              className="text-center p-3 border-2 border-gray-200 hover:border-green-600 rounded-lg transition hover:bg-green-50"
            >
              <span className="text-2xl mb-1 block">🏥</span>
              <span className="text-xs font-semibold text-gray-700">Hospital</span>
            </Link>
            <Link
              to="/signup/doctor"
              className="text-center p-3 border-2 border-gray-200 hover:border-blue-600 rounded-lg transition hover:bg-blue-50"
            >
              <span className="text-2xl mb-1 block">👨‍⚕️</span>
              <span className="text-xs font-semibold text-gray-700">Doctor</span>
            </Link>
            <Link
              to="/signup/patient"
              className="text-center p-3 border-2 border-gray-200 hover:border-purple-600 rounded-lg transition hover:bg-purple-50"
            >
              <span className="text-2xl mb-1 block">🧑‍⚕️</span>
              <span className="text-xs font-semibold text-gray-700">Patient</span>
            </Link>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account?{' '}
            <Link to="/" className="text-teal-600 font-semibold hover:underline">
              Get started
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          Protected by encryption • <a href="#" className="hover:text-gray-700">Privacy Policy</a> • <a href="#" className="hover:text-gray-700">Terms</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
