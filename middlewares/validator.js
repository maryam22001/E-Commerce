const AppError = require('../utils/AppError.js'); 

const validator = schema => async (req, res, next) => {
    try {
        const checkSchema = await schema.validate(req.body, { abortEarly: false });
        req.body = checkSchema;
        if (checkSchema) next();
    } catch (error) {
        next(new AppError(error.errors.join(', '), 400));
    }
};

module.exports = validator;