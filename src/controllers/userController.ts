import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { UserInt } from '../interface/interfaces';
import mongoose from "mongoose";
require("../auth/passportConfig");

class UserController {
    // Login User
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        passport.authenticate('local', (err: Error, user: UserInt, info: any) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).json({ message: 'Internal server error', error: err });
            }
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed', info });
            }
            req.logIn(user, (loginErr: Error) => {
                if (loginErr) {
                    console.error('Login session error:', loginErr);
                    return res.status(500).json({ message: 'Failed to log in', error: loginErr });
                }
                return res.status(200).json({ message: 'Authentication successful', user });
            });
        })(req, res, next);
    }

    // Logout User
    public async logout(req: Request, res: Response): Promise<void> {
        if (typeof req.logout === 'function') {
            req.logout((err: Error) => {
                if (err) {
                    console.error('Logout error:', err);
                    return res.status(500).json({ message: 'Logout failed', error: err });
                }
                return res.status(200).json({ message: 'Logout successful' });
            });
        } else {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destroy error:', err);
                    return res.status(500).json({ message: 'Logout failed', error: err });
                }
                return res.status(200).json({ message: 'Logout successful' });
            });
        }
    }

    // Register User
    public async register(req: Request, res: Response): Promise<Response> {
        const { username, email, password, role, profilePic } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate password length
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                skillSet: [],
                role,
                profilePic,
            });

            // Save the new user
            await newUser.save();
            return res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (err: any) {
            console.error('Registration error:', err);
            return res.status(500).json({ message: 'Error registering user', error: err.message });
        }
    }

    // Get User by ID
    public async getUser(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        try {
            const user = await User.findOne({ _id: id });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (err: any) {
            console.error('Get user error:', err);
            return res.status(500).json({ message: 'Error fetching user', error: err.message });
        }
    }

    // Get All Users
    public async getUsers(_: Request, res: Response): Promise<Response> {
        try {
            const users = await User.find().select('-password'); // Exclude passwords
            return res.status(200).json(users);
        } catch (error: any) {
            console.error('Get users error:', error);
            return res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    }
}

export default new UserController();
