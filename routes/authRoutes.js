const express = require('express');
const { check } = require('express-validator');
const {
  register,
  login,
  adminLogin,
  googleLogin,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('ward', 'Ward is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty()
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

router.post(
  '/admin/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').exists()
  ],
  adminLogin
);

router.post('/google/login', googleLogin);

router.get('/me', protect, getMe);

module.exports = router;