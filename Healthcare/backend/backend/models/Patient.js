const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        emergencyContact: { type: String, default: '' },
        bloodGroup: { type: String, default: '' },
        allergies: [{ type: String }],
        medicalConditions: [{ type: String }],
        accessOtp: { type: String, default: null },
        accessOtpExpires: { type: Date, default: null },
    },
    { timestamps: true }
);

patientSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

patientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
