

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import and use routes
const imageRoutes = require('./routes/imageRoutes');
app.use('/', imageRoutes);

// Global error handler
app.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max size 5MB.' });
    }
    res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
