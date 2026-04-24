const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        // use chalk to color the console log
        console.log(`MongoDB Connected: ${conn.connection.name}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

};

module.exports = connectDB;