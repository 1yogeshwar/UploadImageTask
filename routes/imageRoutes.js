const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const calculatePosition = require('../utils/positioning');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, JPEG, PNG allowed!'), false);
};
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// In-memory store
let images = [];

// GET / → render view (default grid)
router.get('/', (req, res) => {
    const positioned = calculatePosition(images);
    res.render('index', { images: positioned, viewType: req.query.view || 'grid' });
});


// POST /upload → upload single image
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const { orientation } = req.body;
        if (!orientation || !['portrait', 'landscape'].includes(orientation)) {
            return res.status(400).json({ error: 'Valid orientation required' });
        }
        const imageData = {
            id: Date.now(),
            filename: req.file.filename,
            orientation,
            path: `/uploads/${req.file.filename}`,
            uploadDate: new Date()
        };
        images.push(imageData);
        res.redirect('/?uploaded=true');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /delete/:id → remove image
router.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = images.findIndex(img => img.id === id);
    if (index > -1) {
        const filePath = path.join(uploadsDir, images[index].filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        images.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
});

module.exports = router;
