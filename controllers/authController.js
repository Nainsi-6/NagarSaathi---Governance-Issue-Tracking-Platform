const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, ward, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      ward,
      phone
    });

    // Create token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ward: user.ward
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password is entered
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter email and password'
      });
    }

    // Find user in database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ward: user.ward
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
exports.adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Hardcoded admin credentials (for now)
    if (username !== 'Ritika' || password !== 'Ritika@11') {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin credentials'
      });
    }

    // Find admin user in database
    // Fix for adminLogin
const adminUser = await User.findOne({ role: 'admin', email: 'admin@wardwatch.com' }).select('+password');


    if (!adminUser) {
      // Create admin user if not exists (first time)
      const newAdmin = await User.create({
        name: 'Admin',
        email: 'admin@wardwatch.com',
        password: 'Ritika@11',
        ward: 'Admin Ward',
        phone: '0000000000',
        role: 'admin'
      });

      const token = generateToken(newAdmin._id);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role
        }
      });
    }

    // Check if password is correct
    const isPasswordMatched = await adminUser.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin credentials'
      });
    }

    const token = generateToken(adminUser._id);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login with Google
// @route   POST /api/auth/google/login
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        googleId,
        ward: 'Not specified', // User can update later
        phone: 'Not specified' // User can update later
      });
    } else if (!user.googleId) {
      // Update user with Google ID if logging in with Google for first time
      user.googleId = googleId;
      await user.save();
    }

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ward: user.ward
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};