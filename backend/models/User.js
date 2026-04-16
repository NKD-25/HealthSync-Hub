const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'patient'],
    required: true
  },
  phone: {
    type: String
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  // Doctor-specific fields
  specialization: {
    type: String
  },
  licenseNumber: {
    type: String
  },
  // Patient-specific fields
  dateOfBirth: {
    type: Date
  },
  bloodGroup: {
    type: String
  },
  assignedDoctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignedPatients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  registrationDate: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
