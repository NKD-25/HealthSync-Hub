import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const PatientSignup = () => {
  const [step, setStep] = useState(1); // Step 1: Hospital, Step 2: Doctor, Step 3: Personal Info
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hospitalId: '',
    doctorId: '', // Optional - can leave empty
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    bloodGroup: 'O+'
  });

  // Load hospitals on mount
  useEffect(() => {
    loadHospitals();
  }, []);

  // Load doctors when hospital changes
  useEffect(() => {
    if (formData.hospitalId) {
      loadDoctors(formData.hospitalId);
    } else {
      setDoctors([]);
      setFormData(prev => ({ ...prev, doctorId: '' }));
    }
  }, [formData.hospitalId]);

  const loadHospitals = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/hospitals`);
      setHospitals(response.data.hospitals);
    } catch (error) {
      console.error('Error loading hospitals:', error);
      setError('Failed to load hospitals');
    }
  };

  const loadDoctors = async (hospitalId) => {
    try {
      const response = await axios.get(`${API_URL}/auth/hospitals/${hospitalId}/doctors`);
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate step 1
    if (step === 1) {
      if (!formData.hospitalId) {
        setError('Please select a hospital');
        setLoading(false);
        return;
      }
      setStep(2);
      setLoading(false);
      return;
    }

    // Validate step 2
    if (step === 2) {
      setStep(3);
      setLoading(false);
      return;
    }

    // Validate step 3 (Final submission)
    if (step === 3) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      try {
        // Send registration request
        const response = await axios.post(`${API_URL}/auth/patient/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          bloodGroup: formData.bloodGroup,
          hospitalId: formData.hospitalId,
          doctorId: formData.doctorId || undefined // Only send if selected
        });

        console.log('Registration successful:', response.data);
        setSuccess(true);
        
        // Redirect to login after 2 seconds
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setError(err.response?.data?.error || 'Registration failed');
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Main Signup Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🧑‍🦱</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Patient Registration</h1>
          <p className="text-gray-600 mb-4">Create your patient account</p>
          
          {/* Step Indicator */}
          <div className="flex justify-between items-center mb-6">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-1 ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-white'}`}>
                1
              </div>
              <span className="text-xs font-medium">Hospital</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-1 ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-white'}`}>
                2
              </div>
              <span className="text-xs font-medium">Doctor</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-1 ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-white'}`}>
                3
              </div>
              <span className="text-xs font-medium">Details</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ==========================================
              STEP 1: Select Hospital
              ========================================== */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Hospital *
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {hospitals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No hospitals available</p>
                    </div>
                  ) : (
                    hospitals.map(hospital => (
                      <label
                        key={hospital._id}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                          formData.hospitalId === hospital._id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="hospital"
                          value={hospital._id}
                          checked={formData.hospitalId === hospital._id}
                          onChange={() => setFormData(prev => ({ ...prev, hospitalId: hospital._id }))}
                          className="w-4 h-4 text-green-600"
                        />
                        <div className="ml-3">
                          <p className="font-semibold text-gray-800">{hospital.name}</p>
                          <p className="text-xs text-gray-500">{hospital.email}</p>
                          {hospital.address && (
                            <p className="text-xs text-gray-500">{hospital.address.city}</p>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                <p>ℹ️ Select the hospital where you want to register as a patient.</p>
              </div>
            </div>
          )}

          {/* ==========================================
              STEP 2: Select Doctor (Optional)
              ========================================== */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Doctor (Optional)
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-400 transition">
                    <input
                      type="radio"
                      name="doctor"
                      value=""
                      checked={formData.doctorId === ''}
                      onChange={() => setFormData(prev => ({ ...prev, doctorId: '' }))}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="ml-3 text-gray-700 font-medium">No, I'll select later</span>
                  </label>

                  {doctors.length > 0 && (
                    <>
                      {doctors.map(doctor => (
                        <label
                          key={doctor._id}
                          className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                            formData.doctorId === doctor._id
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="doctor"
                            value={doctor._id}
                            checked={formData.doctorId === doctor._id}
                            onChange={() => setFormData(prev => ({ ...prev, doctorId: doctor._id }))}
                            className="w-4 h-4 text-green-600"
                          />
                          <div className="ml-3">
                            <p className="font-semibold text-gray-800">{doctor.name}</p>
                            <p className="text-xs text-gray-500">
                              {doctor.specialization || 'General Practitioner'}
                            </p>
                            <p className="text-xs text-gray-500">{doctor.email}</p>
                          </div>
                        </label>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                <p>ℹ️ You can select a doctor now or assign one later through your dashboard.</p>
              </div>
            </div>
          )}

          {/* ==========================================
              STEP 3: Personal Information
              ========================================== */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="john@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Minimum 6 characters"
                  required
                  minLength="6"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start">
              <span className="mr-2">❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {/* Back Button */}
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                ← Back
              </button>
            )}

            {/* Next/Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 ${step === 3 ? 'flex-2' : ''} bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : step === 3 ? (
                'Complete Registration'
              ) : (
                'Next →'
              )}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PatientSignup;
