const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
