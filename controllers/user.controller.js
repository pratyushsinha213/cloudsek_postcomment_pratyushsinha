import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Register user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." })
        }

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password
        });

        const token = generateToken(user._id);

        return res.cookie('token', token)
            .status(201)
            .json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token
            });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        return res.cookie('token', token)
            .status(201)
            .json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token
            });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Logout user
export const logout = async (req, res) => {
    try {
        // Since we're using JWT, we don't need to do anything on the server side
        // The client should remove the token from local storage
        res.clearCookie('token');
        return res.status(200).json({
            message: 'Logged out successfully',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error during logout',
            success: false
        });
    }
};