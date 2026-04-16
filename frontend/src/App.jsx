import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

// Import Components
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import HospitalSignup from './components/HospitalSignup';
import DoctorSignup from './components/DoctorSignup';
import PatientSignup from './components/PatientSignup';
import ProtectedRoute from './components/ProtectedRoute';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <img src="/images/logo.png" alt="Chikitsa" className="w-20 h-20 mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Chikitsa</h1>
          <p className="text-teal-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        
        {user && (
          <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-gradient-to-r from-green-600 to-teal-600">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-center h-16">
                
                <Link to={`/${user.role}`} className="flex items-center space-x-2 hover:opacity-80 transition">
              
                  <div>
                    <h1 className="text-lg font-bold text-teal-800">Chikitsa</h1>
                    <p className="text-xs text-gray-500">Healthcare Platform</p>
                  </div>
                </Link>

                <div className="flex items-center space-x-8">
                  
                  <div className="hidden md:flex items-center space-x-6">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="text-gray-700 hover:text-green-600 font-medium transition"
                      >
                         Admin
                      </Link>
                    )}

                    {user.role === 'doctor' && (
                      <Link
                        to="/doctor"
                        className="text-gray-700 hover:text-blue-600 font-medium transition"
                      >
                         Doctor
                      </Link>
                    )}

                    {user.role === 'patient' && (
                      <Link
                        to="/patient"
                        className="text-gray-700 hover:text-purple-600 font-medium transition"
                      >
                         Patient
                      </Link>
                    )}
                  </div>

                  <div className="h-8 w-px bg-gray-300 hidden md:block"></div>

                  <div className="flex items-center space-x-4">
                    
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role === 'admin' && ' Administrator'}
                        {user.role === 'doctor' && ' Doctor'}
                        {user.role === 'patient' && ' Patient'}
                      </p>
                    </div>

                    {user.hospitalName && (
                      <div className="text-right hidden lg:block">
                        <p className="text-xs text-gray-600">🏥 {user.hospitalName}</p>
                      </div>
                    )}

                    <button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition font-medium text-sm flex items-center space-x-2 shadow-md"
                    >
                      <span>🚪</span>
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={`/${user.role}`} replace />
              ) : (
                <LandingPage />
              )
            }
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={`/${user.role}`} replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/signup/hospital"
            element={
              user ? (
                <Navigate to={`/${user.role}`} replace />
              ) : (
                <HospitalSignup />
              )
            }
          />

          <Route
            path="/signup/doctor"
            element={
              user ? (
                <Navigate to={`/${user.role}`} replace />
              ) : (
                <DoctorSignup />
              )
            }
          />

          <Route
            path="/signup/patient"
            element={
              user ? (
                <Navigate to={`/${user.role}`} replace />
              ) : (
                <PatientSignup />
              )
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <AdminDashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute user={user} allowedRoles={['doctor']}>
                <DoctorDashboard doctorId={user?._id} user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient"
            element={
              <ProtectedRoute user={user} allowedRoles={['patient']}>
                <PatientDashboard patientId={user?._id} user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border-t-4 border-gradient-to-r from-green-600 to-teal-600">
                  <div className="text-7xl mb-4">404</div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-3">Page Not Found</h1>
                  <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                  <Link
                    to={user ? `/${user.role}` : '/'}
                    className="inline-block bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md"
                  >
                    {user ? '← Back to Dashboard' : '← Back to Home'}
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
