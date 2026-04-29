const crypto = require('crypto');
const User = require('../models/user.js');
const AppError = require('../utils/AppError.js');
const catchAsync = require('../utils/catchAsync.js');

//3SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return next(new AppError('Email already in use', 400));

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await User.create({ name, email, password, otp, otpExpiry });
    console.log('User saved:', newUser);
    console.log(`OTP for ${email}: ${otp}`);

    res.status(201).json({
        success: true,
        message: 'Account created. Check your email for the OTP.',
    });
});

// 2verify OTP
exports.verifyOtp = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await User.findOne({
        email,
        otp,
        otpExpiry: { $gt: Date.now() }
    });
    if (!user) return next(new AppError('Invalid or expired OTP', 400));

    user.isConfirm = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    res.cookie('userId', user._id.toString(), {
        signed: true,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    user.password = undefined;
    res.status(200).json({ success: true, data: user });
});

// 3LOGIN 
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Provide email and password', 400));

    const user = await User.findOne({ email, isDeleted: { $ne: true } }).select('+password');
    console.log('User found:', user);

    if (!user || !(await user.correctPassword(password, user.password)))
        return next(new AppError('Incorrect email or password', 401));

    if (!user.isConfirm) return next(new AppError('Please verify your email first', 403));

    res.cookie('userId', user._id.toString(), {
        signed: true,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    user.password = undefined;
    res.status(200).json({ success: true, data: user });
});

// 4LOGOUT
exports.logout = (req, res) => {
    res.clearCookie('userId');
    res.status(200).json({ success: true, message: 'Logged out' });
};