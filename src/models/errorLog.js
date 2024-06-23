const mongoose = require('mongoose');

const errorLogSchema = mongoose.Schema({
    date: { type: String, required: true, },
    pincode: { type: String, required: true, },
    error: { type: String, required: true, },
})

const Error = mongoose.model('Error', errorLogSchema);
module.exports = Error;