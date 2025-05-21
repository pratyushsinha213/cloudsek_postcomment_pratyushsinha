import {Router} from 'express';
const userRouter = Router();

import { register, login, getProfile, logout } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';


userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.get('/profile', protect, getProfile);

export default userRouter;