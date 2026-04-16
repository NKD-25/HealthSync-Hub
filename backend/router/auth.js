const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Hospital = require('../models/Hospital');

// ==========================================
// HOSPITAL REGISTRATION (Admin creates hospital)
// ==========================================
router.post('/hospital/register', async (req, res) => {
  try {
    const { 
      hospitalName, 
      hospitalEmail, 
      hospitalPhone,
      hospitalAddress,
      licenseNumber,
      adminName,
      adminEmail,
      adminPassword
    } = req.body;

    // Validate required fields
    if (!hospitalName || !hospitalEmail || !licenseNumber || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({ 
      $or: [{ email: hospitalEmail }, { licenseNumber }] 
    });
    if (existingHospital) {
      return res.status(400).json({ error: 'Hospital already registered' });
    }

    // Check if admin email exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin email already exists' });
    }

    // Create admin user
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isVerified: true
    });
    await admin.save();

    // Create hospital
    const hospital = new Hospital({
      name: hospitalName,
      email: hospitalEmail,
      phone: hospitalPhone,
      address: hospitalAddress,
      licenseNumber,
      adminId: admin._id
    });
    await hospital.save();

    // Link hospital to admin
    admin.hospitalId = hospital._id;
    await admin.save();

    console.log(`✅ Hospital registered: ${hospitalName} by ${adminName}`);

    res.status(201).json({
      success: true,
      message: 'Hospital registered successfully',
      hospital: {
        _id: hospital._id,
        name: hospital.name,
        email: hospital.email
      },
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Hospital registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// ==========================================
// DOCTOR REGISTRATION
// ==========================================
router.post('/doctor/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      licenseNumber,
      hospitalId
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !hospitalId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Verify hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // Create doctor user
    const doctor = new User({
      name,
      email,
      password,
      role: 'doctor',
      phone,
      specialization,
      licenseNumber,
      hospitalId,
      assignedPatients: []
    });
    await doctor.save();

    // Add doctor to hospital's doctors list
    hospital.doctors.push(doctor._id);
    await hospital.save();

    console.log(`✅ Doctor registered: ${name} at ${hospital.name}`);

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      user: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        hospitalId: doctor.hospitalId
      }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// ==========================================
// PATIENT REGISTRATION
// ==========================================
router.post('/patient/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      dateOfBirth,
      bloodGroup,
      hospitalId,
      doctorId  // Optional: Assign to specific doctor
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !hospitalId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Verify hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // Create patient user
    const patient = new User({
      name,
      email,
      password,
      role: 'patient',
      phone,
      dateOfBirth,
      bloodGroup,
      hospitalId,
      assignedDoctors: []
    });
    await patient.save();

    // Add patient to hospital's patients list
    hospital.patients.push(patient._id);
    await hospital.save();

    // If doctor specified, assign patient to doctor
    if (doctorId) {
      const doctor = await User.findById(doctorId);
      if (doctor && doctor.role === 'doctor') {
        doctor.assignedPatients.push(patient._id);
        await doctor.save();

        patient.assignedDoctors.push(doctorId);
        await patient.save();
      }
    }

    console.log(`✅ Patient registered: ${name} at ${hospital.name}`);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      user: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
        hospitalId: patient.hospitalId
      }
    });
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// ==========================================
// LOGIN (with password verification)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user and populate hospital info
    const user = await User.findOne({ email })
      .populate('hospitalId', 'name');  // ← Get hospital name too

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    console.log(`✅ User logged in: ${user.name}`);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hospitalId: user.hospitalId?._id || user.hospitalId,  // ✅ Include hospitalId
        hospitalName: user.hospitalId?.name  // ✅ Include hospital name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ==========================================
// GET ALL HOSPITALS (for registration)
// ==========================================
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find({ status: 'active' })
      .select('name email address')
      .sort({ name: 1 });

    res.json({ hospitals });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// GET DOCTORS BY HOSPITAL (for patient registration)
// ==========================================
router.get('/hospitals/:hospitalId/doctors', async (req, res) => {
  try {
    const doctors = await User.find({
      hospitalId: req.params.hospitalId,
      role: 'doctor'
    }).select('name specialization email');

    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
