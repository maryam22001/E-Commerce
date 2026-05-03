const User = require('../models/user');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next(new AppError('Not authenticated. Please log in.', 401));

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET || 'your-secret-key-here');

    const user = await User.findById(decoded.id);
    if (!user || user.isDeleted) return next(new AppError('User not found', 401));

    req.user = user;
    next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role))
        return next(new AppError('You do not have permission', 403));
    next();
};