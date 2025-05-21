import {Router} from 'express';
const userRouter = Router();

// Import controller functions and middleware
import { register, login, getProfile, logout } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// Public routes
userRouter.post('/register', register);  // Register a new user
userRouter.post('/login', login);        // Login existing user
userRouter.post('/logout', logout);      // Logout user

// Protected route for getting user profile as this is sensitive information
// This route should be protected to ensure that only authenticated users can access their profile
userRouter.get('/profile', protect, getProfile);

export default userRouter;