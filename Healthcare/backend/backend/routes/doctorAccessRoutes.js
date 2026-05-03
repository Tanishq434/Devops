const express = require('express');
const router = express.Router();
const { accessPatientRecords } = require('../controllers/doctorAccessController');
const { protect } = require('../middleware/authMiddleware');

const doctorOnly = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a doctor' });
    }
};

router.post('/verify', protect, doctorOnly, accessPatientRecords);

module.exports = router;
