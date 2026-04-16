import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const uploadReport = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/reports/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPatientReports = async (patientId) => {
  try {
    const response = await axios.get(`${API_URL}/reports/patient/${patientId}`);
    return response.data.reports;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const downloadReport = (fileId) => {
  return `${API_URL}/reports/download/${fileId}`;
};

// ⭐ NEW - Delete report function
export const deleteReport = async (reportId) => {
  try {
    const response = await axios.delete(`${API_URL}/reports/${reportId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
