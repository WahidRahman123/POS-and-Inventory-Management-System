const express = require('express');
const User = require('../models/user');
const protect = require('../middleware/authMiddleware');
const users = require('../controllers/users');


const router = express.Router();

//! Add protect to all

//* @route GET /api/users
// @desc All Users fetch
// @access Private
router.get('/', users.index);

//* @route POST /api/users
// @desc Create Users 
// @access Private
router.post('/', users.createUser);

// @route POST /api/users/login
// @desc login
// @access Private
router.post('/login', users.login);

// @route POST /api/users/:id/changepassword/
// @desc login
// @access Private
router.post('/:id/changepassword', users.changeUserPassword);

//* @route DELETE /api/users
// @desc Delete Users 
// @access Private
router.delete('/:id', users.deleteUser);


module.exports = router;