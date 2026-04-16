import React, { useState, useEffect } from 'react';
import { uploadReport } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const DoctorDashboard = ({ doctorId, user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [patients, setPatients] = useState([]);
  const [reportType, setReportType] = useState('prescription');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingPatients, setLoadingPatients] = useState(true);

  const activeDoctorId = doctorId || user?._id;

  useEffect(() => {
    if (!activeDoctorId) return;
    if (!user?.hospitalId) return;
    loadPatients();
  }, [activeDoctorId, user?.hospitalId]);

  const loadPatients = async () => {
    try {
      setLoadingPatients(true);
      const response = await axios.get(
        `${API_URL}/users/hospital/${user.hospitalId}/patients`
      );
      setPatients(response.data.patients);
      setMessage('');
    } catch (error) {
      console.error('Error loading patients:', error);
      setMessage('Error loading patients');
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setMessage('');
    } else {
      setMessage('Please select a PDF file');
      setSelectedFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage('Please select a file');
      return;
    }

    if (!patientId) {
      setMessage('Please select a patient');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('report', selectedFile);
      formData.append('doctorId', activeDoctorId);
      formData.append('patientId', patientId);
      formData.append('reportType', reportType);

      await uploadReport(formData);

      setMessage('✅ Report uploaded successfully!');
      setSelectedFile(null);
      setPatientId('');
      setReportType('prescription');

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading report');
    } finally {
      setUploading(false);
    }
  };

  if (!activeDoctorId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border-t-4 border-blue-600">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600">Doctor ID not found. Please log in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
             
              <div>
                <h1 className="text-4xl font-bold">Doctor Dashboard</h1>
                <p className="text-blue-100">Upload and manage patient reports</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm">👨‍⚕️ Your Patients</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{patients.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-cyan-600">
            <p className="text-gray-600 text-sm">📋 Specialization</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{user?.specialization || 'General'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm">🏥 Hospital</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{user?.hospitalName || 'N/A'}</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 px-6 py-4 rounded-lg shadow-lg ${
            message.includes('✅')
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {message}
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Patient Report</h2>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Patient from {user?.hospitalName} *
              </label>
              {loadingPatients ? (
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading patients...</p>
                </div>
              ) : patients.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-700">
                  ⚠️ No patients available
                </div>
              ) : (
                <>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition"
                    required
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map(patient => (
                      <option key={patient._id} value={patient._id}>
                        🧑‍⚕️ {patient.name} ({patient.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    📊 {patients.length} patients available
                  </p>
                </>
              )}
            </div>

            {/* Report Type */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition"
                >
                  <option value="prescription">💊 Prescription</option>
                  <option value="lab-result">🧪 Lab Result</option>
                  <option value="scan">📷 Scan Report</option>
                  <option value="other">📄 Other</option>
                </select>
              </div>

              <div></div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Upload PDF Report *
              </label>
              <div className="border-3 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition cursor-pointer bg-gray-50 hover:bg-blue-50">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-6xl mb-3">📄</div>
                  {selectedFile ? (
                    <>
                      <p className="text-sm text-gray-700 font-medium">✅ {selectedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 font-medium">Click to upload PDF</p>
                      <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading || patients.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <span className="mr-2">📤</span>
                    Upload Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
          <p className="text-sm text-blue-700">
            <strong>ℹ️ Note:</strong> Uploaded reports will be securely stored and accessible to your assigned patients. Keep report information accurate and complete for better patient care.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
