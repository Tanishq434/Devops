const mongoose = require('mongoose');

const recordSchema = mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Patient' },
        title: { type: String, required: true },
        description: { type: String },
        fileUrl: { type: String, required: true },
        date: { type: Date, default: Date.now },
        summary: { type: String }, // For Watson integration later
    },
    { timestamps: true }
);

const Record = mongoose.model('Record', recordSchema);
module.exports = Record;
