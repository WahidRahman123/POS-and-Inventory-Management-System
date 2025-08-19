const express = require('express');
const User = require('../models/user');
const { protect, admin } = require('../middleware/authMiddleware');
const users = require('../controllers/users');

const router = express.Router();

//* @route GET /api/users
// @desc All Users fetch
// @access Private
router.get('/', protect, admin, users.index);

//* @route POST /api/users
// @desc Create Users 
// @access Private
router.post('/', protect, admin, users.createUser);

// @route POST /api/users/login
// @desc login
// @access Private
router.post('/login', users.login);

// @route POST /api/users/:id/changepassword/
// @desc login
// @access Private
router.post('/:id/changepassword', protect, users.changeUserPassword);

//* @route DELETE /api/users
// @desc Delete Users 
// @access Private
router.delete('/:id', protect, admin, users.deleteUser);


module.exports = router;