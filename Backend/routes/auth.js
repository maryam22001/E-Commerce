const express = require('express');
const router = express.Router();
const { signup, verifyOtp, login, logout } = require('../controllers/auth.js');
const validator = require('../middlewares/validator.js');
const signupSchema = require('../validations/addUser.js'); 
const addUser = require('../validations/addUser.js');
const { forgotPassword, resetPassword } = require('../controllers/auth.js');

router.route('/signup').post(validator(signupSchema), signup);
router.route('/verify-otp').post(verifyOtp);
router.route('/login').post(login);
router.route('/forgot-password').post(forgotPassword);
router.route('/resetPassword/:token').post(resetPassword);
router.route('/logout').get(logout);

module.exports = router;