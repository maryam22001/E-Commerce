const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Instance method to compare password at login
UserSchema.methods.correctPassword = async function (candidate, hashed) {
    return bcrypt.compare(candidate, hashed);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;