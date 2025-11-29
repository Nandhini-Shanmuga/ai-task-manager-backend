
const express = require('express');
const AuthController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { signupValidation, loginValidation } = require('../middleware/validators');

const router = express.Router();

// Public routes
router.post('/signup', signupValidation, AuthController.signup);
router.post('/login', loginValidation, AuthController.login);
router.get("/check-email", AuthController.checkEmail);

// Protected routes
router.get('/getCurrentUser', protect, AuthController.getCurrentUser);
router.post('/logout', protect, AuthController.logout);


module.exports = router;
    