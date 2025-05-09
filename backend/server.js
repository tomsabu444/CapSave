const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//? Connect to MongoDB
connectDB();

// Middlewares
app.use(cors( ));
app.use(express.json());

//! Routes
app.use('/', require('./routes/health'));
app.use('/v1/users', require('./routes/users')); // users route
app.use('/v1/albums', require('./routes/albums')); // albums route
app.use('/v1/media', require('./routes/media')); // media route
// Start server
app.listen(PORT, () => {
  console.log(`✅ CapSave backend is running on port http://localhost:${PORT}`);
});
