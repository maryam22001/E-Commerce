const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validator.js');
const createUser = require('../validations/addUser.js');

const { GetAllUsers, getOneUser, getDeletedUsers, addUser, updateUser, deleteUser, softDeleteUser } = require('../controllers/user.js');
router.route('/').get(GetAllUsers).post(validator(createUser), addUser); // have the router > app call router
//we pass the GetAllUsers method as a callback function to the route handler > when the route is called it will execute the GetAllUsers method and return the response to the client
//route ()> have the main rounte > /Users and then we call the method that we want to execute when the route is called > in this case we want to get all the Users so we call the GetAllUsers method   
//Router is a mini express application that we can use to define our routes and then we can use it in our main app.js file > this way we can keep our code organized and modular    
router.route('/deleted').get(getDeletedUsers); // Evaluate /deleted BEFORE /:id
// router.route('/status').get(getStatus); // Commented out as getStatus is not defined in the controller
router.route('/softDeleted/:id').patch(softDeleteUser);
router.route('/:id').get(getOneUser).patch(updateUser).delete(deleteUser);

module.exports = router;
