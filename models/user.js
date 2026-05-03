const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
        },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
    , 
    ResetToken: String,
    ResetDate: Date
    ,
    otp: String,
    otpExpiry: Date,
    passwordChangedAt: Date,
    isConfirm: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    versionKey: false
});

const User = mongoose.model('User', UserSchema);
module.exports = User;