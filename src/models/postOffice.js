const mongoose = require('mongoose');

const postOfficeSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    pincode: { type: Number, required: true },
    circle: { type: String },
    district: { type: String, required: true },
    division: { type: String },
    region: { type: String },
    state: { type: String, required: true },
    country: { type: String, required: true },
})

const PostOffice = mongoose.model('PostOffice', postOfficeSchema);
module.exports = PostOffice;