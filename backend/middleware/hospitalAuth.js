const User = require('../models/User');

// Verify user belongs to the requested hospital
const verifyHospitalAccess = async (req, res, next) => {
  try {
    const { hospitalId } = req.params;
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Find user and verify they belong to this hospital
    const user = await User.findById(userId);
    if (!user || user.hospitalId.toString() !== hospitalId) {
      return res.status(403).json({ error: 'Access denied. Invalid hospital access.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = verifyHospitalAccess;
