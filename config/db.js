
const mongoose = require('mongoose');

const connectDB = async () => {
    const MONGODB_URI=`mongodb+srv://nazmul:nazmul%401357@cluster0.nqiml.mongodb.net/todoappDB?retryWrites=true&w=majority&appName=Cluster0`
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;