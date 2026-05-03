const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, licenseNumber } = req.body;

    try {
        if (role === 'patient') {
            const userExists = await Patient.findOne({ email });
            if (userExists) return res.status(400).json({ message: 'Patient already exists' });

            const patient = await Patient.create({ name, email, password });
            if (patient) {
                res.status(201).json({
                    _id: patient._id,
                    name: patient.name,
                    email: patient.email,
                    role: 'patient',
                    token: generateToken(patient._id, 'patient'),
                });
            } else {
                res.status(400).json({ message: 'Invalid patient data' });
            }
        } else if (role === 'doctor') {
            if (!licenseNumber) return res.status(400).json({ message: 'License number is required for doctors' });
            
            const userExists = await Doctor.findOne({ email });
            if (userExists) return res.status(400).json({ message: 'Doctor already exists' });

            const doctor = await Doctor.create({ name, email, password, licenseNumber });
            if (doctor) {
                res.status(201).json({
                    _id: doctor._id,
                    name: doctor.name,
                    email: doctor.email,
                    role: 'doctor',
                    token: generateToken(doctor._id, 'doctor'),
                });
            } else {
                res.status(400).json({ message: 'Invalid doctor data' });
            }
        } else {
            res.status(400).json({ message: 'Invalid role specified' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        if (role === 'patient') {
            const user = await Patient.findOne({ email });
            if (user && (await user.matchPassword(password))) {
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: 'patient',
                    token: generateToken(user._id, 'patient'),
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else if (role === 'doctor') {
            const user = await Doctor.findOne({ email });
            if (user && (await user.matchPassword(password))) {
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: 'doctor',
                    token: generateToken(user._id, 'doctor'),
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            res.status(400).json({ message: 'Invalid role specified' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
