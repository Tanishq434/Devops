const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('record'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
        message: 'File Uploaded Successfully',
        file: `/${req.file.path.replace(/\\/g, '/').split('backend/')[1] || 'uploads/' + req.file.filename}`
    });
});

module.exports = router;
