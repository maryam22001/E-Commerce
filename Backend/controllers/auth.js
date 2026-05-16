const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/user.js');
const AppError = require('../utils/AppError.js');
const catchAsync = require('../utils/catchAsync.js');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('../utils/Email.js');

const signToken = async (id) => {
    return await promisify(jwt.sign)({ id }, process.env.JWT_SECRET || 'your-secret-key-here', {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

//3SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return next(new AppError('Email already in use', 400));

    const hashedPassword = await bcrypt.hash(password, 12);

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await User.create({ name, email, password: hashedPassword, otp, otpExpiry });
    console.log('User saved:', newUser);
    console.log(`OTP for ${email}: ${otp}`);

    await sendEmail({
        to: newUser.email,
        subject: 'Your Account Verification OTP',
        text: `Hello ${name},\n\nYour One-Time Password (OTP) for account verification is: ${otp}\n\nThis OTP is valid for 10 minutes.`
    });

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

    const token = await signToken(user._id);

    user.password = undefined;
    res.status(200).json({ success: true, token, data: user });
});

// 3LOGIN 
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Provide email and password', 400));

    const user = await User.findOne({ email, isDeleted: { $ne: true } }).select('+password');
    console.log('User found:', user);

    if (!user || !(await bcrypt.compare(password, user.password)))
        return next(new AppError('Incorrect email or password', 401));

    if (!user.isConfirm) return next(new AppError('Please verify your email first', 403));

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });


    res.status(200).json({ success: true, token, data: user });
});

//forget password
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email, isDeleted: { $ne: true } });
    if (!user) return next(new AppError('No user with that email', 404));       
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.ResetToken = resetToken;
    user.ResetDate = Date.now() + 10 * 60 * 1000;
    await user.save();
    const resetUrl =`http://localhost:4200/auth/reset-password/${resetToken}`;
   await sendEmail({
        to: user.email,
        subject: 'Password Reset',
        text: `Reset your password using this link: ${resetUrl}`
    });
    res.status(200).json({ success: true, message: 'Reset token sent to email' });
});
//reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ ResetToken: token, ResetDate: { $gt: Date.now() } });
    if (!user) return next(new AppError('Invalid or expired token', 400));
    if(password.length<6) return next(new AppError('Password must be at least 6 characters', 400));
   const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.ResetToken = null;
    user.ResetDate = null;
    await user.save();
    res.status(200).json({ success: true, message: 'Password reset successful' });
});

// 4LOGOUT
exports.logout = (req, res) => {
    // With JWT, logouts are typically handled on the client-side by deleting the token.
    res.status(200).json({ success: true, message: 'Logged out' });
};