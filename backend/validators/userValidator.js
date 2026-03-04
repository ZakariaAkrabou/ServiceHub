import {body } from 'express-validator';

export const registerValidator = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('First name must contain only letters'),

  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Last name must contain only letters'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .trim()
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error('Email already exists');
      }
      return true;
    }),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .isIn(['customer', 'service_provider'])
    .withMessage('Role must be either "customer" or "service_provider"'),

  body('serviceDescription')
    .optional({ checkFalsy: true })
    .isLength({ min: 10 })
    .withMessage('Service description must be at least 10 characters long'),

  body('serviceCategory')
    .optional({ checkFalsy: true })
    .isArray({ min: 1 })
    .withMessage('At least one service category is required'),

  body('location')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('Location is required for service providers'),

  body('phone')
    .optional({ checkFalsy: true })
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('image')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Image URL must be a valid URL'),
];

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .trim(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  ]
    