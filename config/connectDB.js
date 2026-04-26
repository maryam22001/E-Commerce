const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.PRODUCTION_DATABASE_URL);
        // use chalk to color the console log
        console.log(`MongoDB Connected: ${conn.connection.name}`);
    } catch (error) {
        console.log(error);
        process.exit(1); // 1 > server craches    0> tries to restart again 
    }

};

module.exports = connectDB;