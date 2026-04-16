import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = ({ user }) => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [tab, setTab] = useState('dashboard');

  useEffect(() => {
    if (!user?.hospitalId) return;
    fetchDoctorsAndPatients();
  }, [user?.hospitalId]);

  const fetchDoctorsAndPatients = async () => {
    try {
      setLoading(true);

      const doctorRes = await axios.get(
        `${API_URL}/users/hospital/${user?.hospitalId}/doctors`
      );

      const patientRes = await axios.get(
        `${API_URL}/users/hospital/${user?.hospitalId}/patients`
      );

      setDoctors(doctorRes.data.doctors);
      setPatients(patientRes.data.patients);
      loadAssignments();
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error loading data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      const doctorRes = await axios.get(
        `${API_URL}/users/hospital/${user?.hospitalId}/doctors`
      );

      const assignmentsList = [];
      for (const doctor of doctorRes.data.doctors) {
        const docDetail = await axios.get(`${API_URL}/users/${doctor._id}`);
        const assignedPatients = docDetail.data.user.assignedPatients || [];

        if (assignedPatients.length > 0) {
          assignmentsList.push({
            doctor: doctor.name,
            doctorId: doctor._id,
            count: assignedPatients.length,
            patients: assignedPatients
          });
        }
      }
      setAssignments(assignmentsList);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedPatient) {
      setMessage('Please select both doctor and patient');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/assign-patient`, {
        doctorId: selectedDoctor,
        patientId: selectedPatient
      });

      setMessage(`✅ ${response.data.patient.name} assigned to Dr. ${response.data.doctor.name}`);
      setMessageType('success');

      setSelectedDoctor('');
      setSelectedPatient('');

      setTimeout(() => {
        fetchDoctorsAndPatients();
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Assignment failed');
      setMessageType('error');
    }
  };

  const handleUnassign = async (doctorId, patientId) => {
    if (!window.confirm('Remove this assignment?')) return;

    try {
      await axios.post(`${API_URL}/users/unassign-patient`, {
        doctorId,
        patientId
      });

      setMessage('✅ Assignment removed');
      setMessageType('success');

      setTimeout(() => {
        fetchDoctorsAndPatients();
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage('Error removing assignment');
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              
              <div>
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-green-100">Manage hospital staff and patient assignments</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm">👨‍⚕️ Total Doctors</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{doctors.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm">🧑‍⚕️ Total Patients</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{patients.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm">🔗 Active Assignments</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              {assignments.reduce((sum, a) => sum + a.count, 0)}
            </p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 px-6 py-4 rounded-lg shadow-lg ${
            messageType === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 bg-white rounded-lg shadow p-2">
          <button
            onClick={() => setTab('assign')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              tab === 'assign'
                ? 'bg-green-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔗 Assign Patients
          </button>
          <button
            onClick={() => setTab('view')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              tab === 'view'
                ? 'bg-green-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📋 View Assignments
          </button>
        </div>

        {/* Tab Content */}
        {tab === 'assign' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Assign Patient to Doctor</h2>

            {doctors.length === 0 || patients.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-yellow-700">
                ⚠️ You need at least one doctor and one patient to make assignments
              </div>
            ) : (
              <form onSubmit={handleAssign} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Doctor
                    </label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                      required
                    >
                      <option value="">-- Choose Doctor --</option>
                      {doctors.map(doctor => (
                        <option key={doctor._id} value={doctor._id}>
                          👨‍⚕️ {doctor.name} - {doctor.specialization || 'General'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Patient
                    </label>
                    <select
                      value={selectedPatient}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                      required
                    >
                      <option value="">-- Choose Patient --</option>
                      {patients.map(patient => (
                        <option key={patient._id} value={patient._id}>
                          🧑‍⚕️ {patient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  🔗 Assign Patient to Doctor
                </button>
              </form>
            )}
          </div>
        )}

        {tab === 'view' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Assignments</h2>

            {assignments.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center text-gray-600">
                📭 No assignments yet
              </div>
            ) : (
              <div className="space-y-6">
                {assignments.map((assignment, idx) => (
                  <div key={idx} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        👨‍⚕️ Dr. {assignment.doctor}
                      </h3>
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                        {assignment.count} patient{assignment.count !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {assignment.patients.map((patientId, pidx) => {
                        const patient = patients.find(p => p._id === patientId);
                        return patient ? (
                          <div key={pidx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">🧑‍⚕️ {patient.name}</p>
                              <p className="text-xs text-gray-500">{patient.email}</p>
                            </div>
                            <button
                              onClick={() => handleUnassign(assignment.doctorId, patientId)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded font-medium transition"
                            >
                              ❌ Remove
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
