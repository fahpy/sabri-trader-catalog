const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Data Parsing Middleware
app.use(cors());
app.use(express.json());

// Serve your front-end automatically
app.use(express.static(path.join(__dirname, '../front-end')));

// ==========================================
// 1. THE FACTORY VAULT API (X-RAY SCANNER)
// ==========================================
app.get('/api/vault/:category', (req, res) => {
    const category = req.params.category;
    const directoryPath = path.join(__dirname, '../front-end/products', category);

    try {
        if (!fs.existsSync(directoryPath)) {
            return res.status(404).json({ error: "Category vault not found", files: [] });
        }

        const allFiles = fs.readdirSync(directoryPath);
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.PNG'];
        const imagesOnly = allFiles.filter(file => validExtensions.includes(path.extname(file)));

        res.json({ 
            category: category, 
            totalFound: imagesOnly.length, 
            files: imagesOnly 
        });

    } catch (error) {
        console.error("Vault Security Error:", error);
        res.status(500).json({ error: "Internal factory server error" });
    }
});

// ==========================================
// 2. THE QUOTE REQUEST ENGINE (LEAD CAPTURE)
// ==========================================
app.post('/api/quote', (req, res) => {
    const { email, message } = req.body;
    
    // 1. Print the alert directly in your terminal
    console.log(`\n🚨 NEW FACTORY QUOTE REQUEST 🚨`);
    console.log(`Client Email: ${email}`);
    console.log(`Details: ${message}\n`);

    // 2. Save the lead securely to a local file so you never lose it
    const logEntry = `Date: ${new Date().toLocaleString()}\nEmail: ${email}\nMessage: ${message}\n-----------------------\n`;
    const logPath = path.join(__dirname, 'client_leads_vault.txt');
    
    try {
        fs.appendFileSync(logPath, logEntry);
        // 3. Send the success message back to the client's screen
        res.json({ message: "Quote request successfully securely transmitted to the factory floor. Our executive team will contact you shortly!" });
    } catch (err) {
        console.error("Failed to save lead:", err);
        res.status(500).json({ message: "System error, please try emailing us directly." });
    }
});

// Start the high-performance engine
app.listen(PORT, () => {
    console.log(`🚀 SABRI TRADER BACKEND LIVE ON PORT ${PORT}`);
    console.log(`📡 Database & Quote Engine connection established. Awaiting front-end requests...`);
});