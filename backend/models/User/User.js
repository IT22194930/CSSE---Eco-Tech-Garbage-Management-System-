// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Adjust roles as needed
//     address: { type: String },
//     phone: { type: String },
//     photoUrl: { type: String },
//     qrCodeUrl: { type: String },
//     userType: { type: String },
//     balance: { type: Number, default: 0.0 }
// }, { timestamps: true });

// const User = mongoose.model('User', userSchema);

// module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Adjust roles as needed
    address: { type: String },
    phone: { type: String },
    photoUrl: { type: String },
    qrCodeUrl: { type: String },
    userType: { type: String },
    balance: { type: Number, default: 0.0 },
    latitude: { type: Number },  // Add latitude for storing user's location
    longitude: { type: Number }, // Add longitude for storing user's location
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
