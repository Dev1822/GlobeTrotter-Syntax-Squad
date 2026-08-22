// ---------------------------------------------------------
// Express Application Entry Point
// ---------------------------------------------------------

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Routes ----
const activityRoutes = require('./routes/activityRoutes');
app.use('/api', activityRoutes);

// ---- Health check ----
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---- Start server ----
app.listen(PORT, () => {
    console.log(`🌍 GlobeTrotter API running on http://localhost:${PORT}`);
});

module.exports = app;
