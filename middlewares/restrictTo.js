//send the role to it 
const catchAsync = require('../utils/catchAsync');

const restrictTo = (...roles) => catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)){
        return next(new AppError('You do not have permission', 403));
    next();
    }else{
        next(new AppError('You do not have permission', 403));
    }
});

module.exports = restrictTo;