const { body } = require('express-validator');

const signupValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3, max: 15 }).withMessage('Name must be 3-15 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

const taskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 50 }).withMessage('Title cannot exceed 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('priority')
    .notEmpty().withMessage('Priority is required')
    .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority value'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed','pending']).withMessage('Invalid status value'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      if (value && new Date(value) < new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    })
];

module.exports = {
  signupValidation,
  loginValidation,
  taskValidation
};