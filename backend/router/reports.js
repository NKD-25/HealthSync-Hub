const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const Report = require('../models/Report');

// Configure multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Upload PDF report
router.post('/upload', upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { doctorId, patientId, reportType } = req.body;

    if (!doctorId || !patientId) {
      return res.status(400).json({ error: 'Doctor ID and Patient ID are required' });
    }

    console.log(`📤 Uploading report for patient: ${patientId}`);

    // Get database connection
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, {
      bucketName: 'reports'
    });

    // Create a unique filename
    const filename = `${Date.now()}-${req.file.originalname}`;

    // Create upload stream
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        originalName: req.file.originalname,
        uploadedBy: doctorId,
        patientId: patientId,
        uploadDate: new Date(),
        contentType: req.file.mimetype
      }
    });

    // Write file buffer to GridFS
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      try {
        console.log(`✅ File uploaded to GridFS with ID: ${uploadStream.id}`);

        // Create report document
        const report = new Report({
          fileId: uploadStream.id,
          filename: filename,
          originalName: req.file.originalname,
          patientId,
          doctorId,
          reportType: reportType || 'other'
        });

        await report.save();

        console.log(`✅ Report saved to database: ${report._id}`);

        // Emit socket event to patient
        const io = req.app.get('io');
        io.to(patientId).emit('new-report', {
          _id: report._id,
          originalName: report.originalName,
          reportType: report.reportType,
          uploadDate: report.uploadDate,
          doctorId: report.doctorId,
          fileId: report.fileId
        });

        console.log(`📨 Socket event sent to patient ${patientId}`);

        res.status(201).json({
          success: true,
          message: 'Report uploaded successfully',
          report: {
            _id: report._id,
            originalName: report.originalName,
            reportType: report.reportType,
            uploadDate: report.uploadDate,
            fileId: report.fileId
          }
        });
      } catch (error) {
        console.error('❌ Error saving report:', error);
        res.status(500).json({ error: 'Error saving report metadata' });
      }
    });

    uploadStream.on('error', (error) => {
      console.error('❌ GridFS upload error:', error);
      res.status(500).json({ error: 'Error uploading file to GridFS' });
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get all reports for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name')
      .sort({ uploadDate: -1 });

    console.log(`📋 Found ${reports.length} reports for patient ${req.params.patientId}`);

    res.json({ reports });
  } catch (error) {
    console.error('❌ Error fetching reports:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Download report
router.get('/download/:fileId', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, {
      bucketName: 'reports'
    });

    // Find the file first
    const files = await db.collection('reports.files').findOne({
      _id: new mongoose.Types.ObjectId(req.params.fileId)
    });

    if (!files) {
      return res.status(404).json({ error: 'File not found' });
    }

    console.log(`⬇️ Downloading file: ${files.filename}`);

    // Set response headers
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="${files.metadata.originalName || files.filename}"`);

    // Create download stream
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(req.params.fileId)
    );

    downloadStream.on('error', (error) => {
      console.error('❌ Download error:', error);
      if (!res.headersSent) {
        res.status(404).json({ error: 'File not found' });
      }
    });

    // Pipe file to response
    downloadStream.pipe(res);

  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete report - UPDATED WITH ERROR HANDLING
router.delete('/:reportId', async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Try to delete from GridFS (handle if file doesn't exist)
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, {
      bucketName: 'reports'
    });

    try {
      // Check if file exists first
      const fileExists = await db.collection('reports.files').findOne({
        _id: new mongoose.Types.ObjectId(report.fileId)
      });

      if (fileExists) {
        // File exists, delete it
        await bucket.delete(new mongoose.Types.ObjectId(report.fileId));
        console.log(`✅ GridFS file deleted: ${report.fileId}`);
      } else {
        // File doesn't exist, that's okay - maybe already deleted
        console.log(`⚠️ GridFS file not found (already deleted): ${report.fileId}`);
      }
    } catch (gridfsError) {
      // Handle any GridFS errors gracefully
      console.log(`⚠️ GridFS delete error (continuing): ${gridfsError.message}`);
    }

    // Always delete the report document from reports collection
    await Report.findByIdAndDelete(req.params.reportId);

    console.log(`✅ Report document deleted: ${req.params.reportId}`);

    res.json({ 
      success: true, 
      message: 'Report deleted successfully' 
    });

  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
  }
});

module.exports = router;
