const express = require('express');
const router = express.Router();
const {
    getPatientProfile,
    updatePatientProfile,
    getPatientRecords,
    addPatientRecord,
    generateOtp,
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

// Middleware to ensure user is a patient
const patientOnly = (req, res, next) => {
    if (req.user && req.user.role === 'patient') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a patient' });
    }
};

router.route('/profile')
    .get(protect, patientOnly, getPatientProfile)
    .put(protect, patientOnly, updatePatientProfile);

router.route('/records')
    .get(protect, patientOnly, getPatientRecords)
    .post(protect, patientOnly, addPatientRecord);

router.post('/generate-otp', protect, patientOnly, generateOtp);

module.exports = router;
