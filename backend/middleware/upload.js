const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital-mgmt';

// Create storage engine for GridFS
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'reports',
          metadata: {
            originalName: file.originalname,
            uploadedBy: req.body.doctorId,
            patientId: req.body.patientId,
            uploadDate: new Date()
          }
        };
        resolve(fileInfo);
      });
    });
  }
});

// Wait for storage to be ready before creating upload instance
storage.on('connection', (db) => {
  console.log('✅ GridFS storage connected');
});

storage.on('connectionFailed', (err) => {
  console.error('❌ GridFS storage connection failed:', err);
});

const upload = multer({ 
  storage,
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

module.exports = upload;
