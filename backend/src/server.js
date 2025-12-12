// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const adminRoutes = require('./routes/adminRoutes');   // ✅ Only once!

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads/notes', express.static(path.join(__dirname, '../uploads')));

// Debug (optional)
try {
    console.log('authRoutes keys:', Object.keys(authRoutes || {}));
    console.log('noteRoutes keys:', Object.keys(noteRoutes || {}));
    console.log('adminRoutes keys:', Object.keys(adminRoutes || {}));
} catch (err) {
    console.log('Error inspecting routes:', err.message);
}

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/admin', adminRoutes);   // ✅ Only once, correctly placed

// Home route
app.get('/', (req, res) => {
    res.send('College Notes Exchange API is running!');
});

// Error Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!', error: err.message });
});

const PORT = process.env.PORT || 5000;
try {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
}
const cors = require("cors");
app.use(cors({
  origin: "*",     // for production replace with frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
