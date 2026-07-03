// back-end/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Enable Cross-Origin Resource Sharing (fixes 'Failed to fetch' errors)
app.use(cors());

const ROOT_DIR = path.join(__dirname, '..');

// 1. SECURE API ENDPOINT 
app.get('/api/products/:category', (req, res) => {
    // SECURITY FIX: path.basename strips out malicious directory traversal attempts (e.g., ../../../etc/passwd)
    const folderName = path.basename(req.params.category);
    const dirPath = path.join(ROOT_DIR, 'front-end', 'products', folderName);
    
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error(`[API Error] Folder not found: ${dirPath}`);
            return res.status(404).json({ error: "Product category not found." });
        }
        
        // Filter for images only
        const imageFiles = files.filter(f => /\.(jpe?g|png|gif|webp|avif)$/i.test(f));
        res.status(200).json(imageFiles);
    });
});

// 2. SERVE STATIC FRONTEND
// Express handles all mime-types safely out of the box
app.use(express.static(path.join(ROOT_DIR, 'front-end')));

// 3. SPA CATCH-ALL
app.get('*', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'front-end', 'index.html'));
});

// 4. SERVERLESS EXPORT & LOCAL BOOT
// Vercel requires the app to be exported, not listened to. We only listen if running locally.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`========================================`);
        console.log(`🚀 Express Engine Online!`);
        console.log(`👉 Running on http://localhost:${PORT}`);
        console.log(`========================================`);
    });
}

// Required for Vercel Serverless Functions
module.exports = app;