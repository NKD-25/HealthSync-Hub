import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Download report file
export const downloadReport = async (fileId, filename) => {
  try {
    console.log(`📥 Downloading: ${filename}`);

    // Request file with blob response type
    const response = await axios.get(
      `${API_URL}/reports/download/${fileId}`,
      {
        responseType: 'blob'  // ✅ IMPORTANT: Get binary data
      }
    );

    // Create blob from response
    const blob = new Blob([response.data], { type: 'application/pdf' });

    // Create temporary download link
    const url = window.URL.createObjectURL(blob);

    // Create anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'report.pdf';

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log(`✅ Download started: ${filename}`);

    return true;
  } catch (error) {
    console.error('❌ Download error:', error);
    throw error;
  }
};

// Get all reports for patient
export const getPatientReports = async (patientId) => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/patient/${patientId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

// Delete report
export const deleteReport = async (reportId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/reports/${reportId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};
