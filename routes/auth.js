const express = require('express');
const router = express.Router();
const { signup, verifyOtp, login, logout } = require('../controllers/auth.js');
const validator = require('../middlewares/validator.js');
const signupSchema = require('../validations/addUser.js'); 
const addUser = require('../validations/addUser.js');

router.post('/signup', validator(addUser), signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;