const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRouters');
const taskRoutes = require('./routes/taskRouters');
const passport = require('passport'); 

require('dotenv').config();
require('./config/passport'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Connect to MongoDB
connectDB();

app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));