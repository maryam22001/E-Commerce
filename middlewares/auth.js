const User = require('../models/user');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
    const userId = req.signedCookies.userId;
    if (!userId) return next(new AppError('Not authenticated. Please log in.', 401));

    const user = await User.findById(userId);
    if (!user || user.isDeleted) return next(new AppError('User not found', 401));

    req.user = user;
    next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role))
        return next(new AppError('You do not have permission', 403));
    next();
};