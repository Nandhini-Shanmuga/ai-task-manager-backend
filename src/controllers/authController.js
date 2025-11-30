  const { validationResult } = require('express-validator');
  const User = require('../models/userModel');
  const { AppError } = require('../utils/appError');
  const { generateToken } = require('../utils/jwtUtils');

  class AuthController {
    // Signup
    static async signup(req, res) {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}


    // Login
   static async login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      message: 'Login successfully',
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        },
        token
      }
    });

  } catch (error) {
    next(error);
  }
}


    // Get current user
    static async getCurrentUser(req, res, next) {
      try {
        if (!req.user) {
          throw new AppError('User not authenticated', 401);
        }

        res.json({
          success: true,
          data:{
             user: {
            id: req.user._id.toString(),
            name: req.user.name,
            email: req.user.email,
            createdAt: req.user.createdAt
          }}
         
        });
      } catch (error) {
        next(error);
      }
    }

    // Logout 
    static async logout(req, res, next) {
      try {
        res.json({
          success: true,
          message: 'Logged out successfully'
        });
      } catch (error) {
        next(error);
      }
    }
    //check email if its already registered
    static async checkEmail(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const existingUser = await User.findOne({ email }).
    select('_id')
      .lean()
      .maxTimeMS(5000)   // hard timeout after 5 seconds
      .exec();

    if (existingUser) {
      return res.json({
        success: true,
        exists: true,
        message: "Email already exists"
      });
    }
     // Email is available 
    return res.json({
      success: true,
      exists: false
      
    });
 

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}


  }

  module.exports = AuthController;
