const Patient = require('../models/Patient');
const Record = require('../models/Record');

// @desc    Access patient records using OTP
// @route   POST /api/doctor-access/verify
// @access  Private (Doctor only)
const accessPatientRecords = async (req, res) => {
    try {
        const { patientEmail, otp } = req.body;

        if (!patientEmail || !otp) {
            return res.status(400).json({ message: 'Patient email and OTP are required' });
        }

        const patient = await Patient.findOne({ email: patientEmail });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Check if OTP matches and is not expired
        if (patient.accessOtp === otp && patient.accessOtpExpires > new Date()) {
            // Success! Fetch records
            const records = await Record.find({ patient: patient._id });
            
            res.json({
                patient: {
                    _id: patient._id,
                    name: patient.name,
                    email: patient.email,
                    bloodGroup: patient.bloodGroup,
                    allergies: patient.allergies,
                    medicalConditions: patient.medicalConditions,
                    emergencyContact: patient.emergencyContact
                },
                records
            });
        } else {
            res.status(401).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { accessPatientRecords };
