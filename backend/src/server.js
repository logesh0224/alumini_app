// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import route files
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes = require('./routes/aluminiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const jobRoutes = require('./routes/jobRoutes');
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Mount routes
app.use('/api/students', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false, 
    message: 'Server Error'
  });
});
app.use(express.static(path.join(__dirname,"../../frontend/dist")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0',() =>{
  console.log(`Connected to Port ${PORT}`)

})
