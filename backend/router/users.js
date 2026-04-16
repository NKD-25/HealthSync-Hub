const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const bcrypt = require('bcryptjs');

// ==========================================
// GET ALL USERS BY ROLE (General)
// ==========================================
router.get('/role/:role', async (req, res) => {
  try {
    const { role } = req.params;

    // Validate role
    if (!['admin', 'doctor', 'patient'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const users = await User.find({ role })
      .select('_id name email role hospitalId')
      .sort({ name: 1 });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// GET PATIENTS BY HOSPITAL (Hospital-Isolated)
// ==========================================
router.get('/hospital/:hospitalId/patients', async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Validate hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // Get all patients in this hospital ONLY
    const patients = await User.find({
      hospitalId: hospitalId,
      role: 'patient'
    }).select('_id name email phone dateOfBirth bloodGroup').sort({ name: 1 });

    console.log(`📋 Fetched ${patients.length} patients from hospital ${hospitalId}`);

    res.json({
      success: true,
      patients,
      hospitalName: hospital.name,
      count: patients.length
    });
  } catch (error) {
    console.error('Error fetching hospital patients:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// GET DOCTORS BY HOSPITAL (Hospital-Isolated)
// ==========================================
router.get('/hospital/:hospitalId/doctors', async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Validate hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // Get all doctors in this hospital ONLY
    const doctors = await User.find({
      hospitalId: hospitalId,
      role: 'doctor'
    }).select('_id name specialization email phone licenseNumber').sort({ name: 1 });

    console.log(`👨‍⚕️ Fetched ${doctors.length} doctors from hospital ${hospitalId}`);

    res.json({
      success: true,
      doctors,
      hospitalName: hospital.name,
      count: doctors.length
    });
  } catch (error) {
    console.error('Error fetching hospital doctors:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// GET STAFF BY HOSPITAL (Admins to assign patients)
// ==========================================
router.get('/hospital/:hospitalId/staff', async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Validate hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // Get doctors and admin staff from this hospital
    const staff = await User.find({
      hospitalId: hospitalId,
      role: { $in: ['doctor', 'admin'] }
    }).select('_id name role specialization').sort({ name: 1 });

    res.json({
      success: true,
      staff,
      hospitalName: hospital.name,
      count: staff.length
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// GET SINGLE USER BY ID
// ==========================================
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate('hospitalId', 'name email')
      .select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// GET DOCTOR'S PATIENTS (For doctor dashboard)
// ==========================================
router.get('/doctor/:doctorId/patients', async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Find doctor and get their hospital
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Get doctor's assigned patients from same hospital
    const patients = await User.find({
      _id: { $in: doctor.assignedPatients },
      hospitalId: doctor.hospitalId
    }).select('_id name email phone');

    res.json({
      success: true,
      patients,
      count: patients.length
    });
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// CREATE USER (Quick Create - Admin)
// ==========================================
router.post('/create', async (req, res) => {
  try {
    const { name, email, password, role, hospitalId, specialization } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password, // Will be hashed by pre-save hook
      role,
      hospitalId,
      specialization: role === 'doctor' ? specialization : undefined
    });

    await user.save();

    console.log(`✅ User created: ${name} (${role})`);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// ==========================================
// ASSIGN PATIENT TO DOCTOR (within same hospital)
// ==========================================
router.post('/assign-patient', async (req, res) => {
  try {
    const { doctorId, patientId } = req.body;

    if (!doctorId || !patientId) {
      return res.status(400).json({ error: 'Doctor ID and Patient ID required' });
    }

    // Get doctor and patient
    const doctor = await User.findById(doctorId);
    const patient = await User.findById(patientId);

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // ✅ Verify they're from the same hospital
    if (doctor.hospitalId.toString() !== patient.hospitalId.toString()) {
      return res.status(403).json({
        error: 'Cannot assign: Doctor and patient are from different hospitals'
      });
    }

    // Check if already assigned
    if (doctor.assignedPatients.includes(patientId)) {
      return res.status(400).json({ error: 'Patient already assigned to this doctor' });
    }

    // Assign patient to doctor
    doctor.assignedPatients.push(patientId);
    await doctor.save();

    // Assign doctor to patient
    patient.assignedDoctors.push(doctorId);
    await patient.save();

    console.log(`✅ Assigned patient ${patient.name} to doctor ${doctor.name}`);

    res.json({
      success: true,
      message: 'Patient assigned successfully',
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        assignedPatientsCount: doctor.assignedPatients.length
      },
      patient: {
        _id: patient._id,
        name: patient.name,
        assignedDoctorsCount: patient.assignedDoctors.length
      }
    });
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// UNASSIGN PATIENT FROM DOCTOR
// ==========================================
router.post('/unassign-patient', async (req, res) => {
  try {
    const { doctorId, patientId } = req.body;

    const doctor = await User.findById(doctorId);
    const patient = await User.findById(patientId);

    if (!doctor || !patient) {
      return res.status(404).json({ error: 'Doctor or Patient not found' });
    }

    // Remove from doctor's list
    doctor.assignedPatients = doctor.assignedPatients.filter(
      id => id.toString() !== patientId
    );
    await doctor.save();

    // Remove from patient's list
    patient.assignedDoctors = patient.assignedDoctors.filter(
      id => id.toString() !== doctorId
    );
    await patient.save();

    console.log(`✅ Unassigned patient ${patient.name} from doctor ${doctor.name}`);

    res.json({ success: true, message: 'Patient unassigned successfully' });
  } catch (error) {
    console.error('Unassignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// GET HOSPITAL INFO
// ==========================================
router.get('/hospital/:hospitalId/info', async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const hospital = await Hospital.findById(hospitalId)
      .populate('doctors', 'name specialization')
      .populate('patients', 'name email')
      .populate('adminId', 'name email');

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json({
      success: true,
      hospital: {
        _id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        phone: hospital.phone,
        address: hospital.address,
        doctorsCount: hospital.doctors.length,
        patientsCount: hospital.patients.length,
        admin: hospital.adminId
      }
    });
  } catch (error) {
    console.error('Error fetching hospital info:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// UPDATE USER PROFILE
// ==========================================
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, dateOfBirth, bloodGroup, specialization } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name,
          phone,
          dateOfBirth,
          bloodGroup,
          specialization
        }
      },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
