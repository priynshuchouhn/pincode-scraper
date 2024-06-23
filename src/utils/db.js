const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const connectDb = () => {
    const URL = process.env.MONGO_URL;
    return mongoose.connect(URL);
}

module.exports = connectDb