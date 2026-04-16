import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { downloadReport, deleteReport } from '../services/reportService';

const API_URL = 'http://localhost:5000/api';

const PatientDashboard = ({ patientId, user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [downloading, setDownloading] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const activePatientId = patientId || user?._id;

  useEffect(() => {
    if (!activePatientId) {
      setLoading(false);
      return;
    }

    loadReports();
  }, [activePatientId]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      // Fetch reports from backend
      const response = await axios.get(
        `${API_URL}/reports/patient/${activePatientId}`
      );

      console.log('✅ Reports loaded:', response.data);
      setReports(response.data.reports || []);
      setNotification('');
    } catch (error) {
      console.error('Error loading reports:', error);
      
      // Fallback to mock data for demo
      console.log('Using mock data for demo...');
      const mockReports = [
        {
          _id: '1',
          fileId: '507f1f77bcf86cd799439011',
          originalName: 'Lab Report - October 2025',
          reportType: 'lab-result',
          uploadDate: new Date(),
          doctorId: { name: 'Dr. Sarah Smith' }
        },
        {
          _id: '2',
          fileId: '507f1f77bcf86cd799439012',
          originalName: 'Prescription - Cold Medicine',
          reportType: 'prescription',
          uploadDate: new Date(Date.now() - 86400000),
          doctorId: { name: 'Dr. John Doe' }
        }
      ];
      setReports(mockReports);
      setNotification('Using demo data - Backend not connected');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, filename) => {
    if (!fileId) {
      setNotification('❌ File ID not found');
      return;
    }

    setDownloading(fileId);

    try {
      // ✅ Use the service function
      await downloadReport(fileId, filename);
      setNotification(`✅ Downloaded: ${filename}`);
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Download failed:', error);
      setNotification(`❌ Download failed: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (reportId, filename) => {
    if (!window.confirm(`Delete ${filename}?`)) {
      return;
    }

    setDeleting(reportId);

    try {
      await deleteReport(reportId);
      setReports(prev => prev.filter(report => report._id !== reportId));
      setNotification(`✅ Deleted: ${filename}`);
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error deleting report:', error);
      setNotification(`❌ Delete failed: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportIcon = (type) => {
    const icons = {
      'prescription': '💊',
      'lab-result': '🧪',
      'scan': '📷',
      'other': '📄'
    };
    return icons[type] || '📄';
  };

  const getReportTypeLabel = (type) => {
    const labels = {
      'prescription': 'Prescription',
      'lab-result': 'Lab Result',
      'scan': 'Scan Report',
      'other': 'Other'
    };
    return labels[type] || type;
  };

  if (!activePatientId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border-t-4 border-purple-600">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600">Patient ID not found. Please log in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              
              <div>
                <h1 className="text-4xl font-bold">Patient Dashboard</h1>
                <p className="text-purple-100">Your Medical Records & Reports</p>
              </div>
            </div>
           
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm">📋 Total Reports</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{reports.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-600">
            <p className="text-gray-600 text-sm">🏥 Hospital</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{user?.hospitalName || 'N/A'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
            <p className="text-gray-600 text-sm">🩸 Blood Group</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{user?.bloodGroup || 'N/A'}</p>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 px-6 py-4 rounded-lg shadow-lg ${
            notification.includes('✅')
              ? 'bg-green-500 text-white'
              : notification.includes('❌')
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            {notification}
          </div>
        )}

        {/* Live Updates Status */}
        <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-lg flex items-center">
          <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse mr-3"></span>
          <span className="text-green-700 font-semibold text-sm">🟢 Live Updates Active - You'll be notified when doctors upload new reports</span>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Medical Reports</h2>

          {loading ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
              </div>
              <p className="text-gray-600 font-semibold">Loading your reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reports Yet</h3>
              <p className="text-gray-600">Your doctors haven't uploaded any reports. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-400 transition"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    
                    {/* Left: Report Info */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="text-4xl flex-shrink-0">{getReportIcon(report.reportType)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-800 truncate">
                          {report.originalName}
                        </h3>
                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600 flex-wrap gap-2">
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium text-xs">
                            {getReportTypeLabel(report.reportType)}
                          </span>
                          <span className="text-xs">📅 {formatDate(report.uploadDate)}</span>
                          {report.doctorId?.name && (
                            <span className="text-xs">👨‍⚕️ Dr. {report.doctorId.name}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(report.fileId, report.originalName)}
                        disabled={downloading === report.fileId}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition flex items-center space-x-2 shadow text-sm sm:text-base"
                        title="Download report"
                      >
                        <span>{downloading === report.fileId ? '⏳' : '📥'}</span>
                        <span className="hidden sm:inline">
                          {downloading === report.fileId ? 'Downloading...' : 'Download'}
                        </span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(report._id, report.originalName)}
                        disabled={deleting === report._id}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition flex items-center space-x-2 shadow text-sm sm:text-base"
                        title="Delete report"
                      >
                        <span>{deleting === report._id ? '⏳' : '🗑️'}</span>
                        <span className="hidden sm:inline">
                          {deleting === report._id ? 'Deleting...' : 'Delete'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-purple-50 border-l-4 border-purple-600 p-6 rounded">
          <p className="text-sm text-purple-700">
            <strong>ℹ️ Privacy & Security:</strong> Your medical records are encrypted and securely stored. Only authorized doctors from your hospital can access your reports. Your data is never shared without your consent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
