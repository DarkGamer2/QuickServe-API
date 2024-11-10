// FILE: userController.ts
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { UserInt } from '../../interface/interfaces';
import bcrypt from 'bcrypt';
import User from '../models/User';
require("../auth/passportConfig")

//TODO: fix login and register functions
class userController {
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        passport.authenticate('local', (err: Error, user: UserInt, info: any) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed', info });
            }
            req.logIn(user, (err: Error) => {
                if (err) {
                    return next(err);
                }
                return res.status(200).json({ message: 'Authentication successful', user });
            });
        })(req, res, next);
    }

    public logout(req: Request, res: Response): void {
        req.logout((err: Error) => {
            if (err) {
                return res.status(500).json({ message: 'Logout failed', err });
            }
            res.status(200).json({ message: 'Logout successful' });
        });
    }

    public async register(req: Request, res: Response): Promise<void> {
        const user = new User(req.body);
        if (typeof user.password !== 'string') {
            res.status(400).json({ message: 'Invalid password' });
            return;
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUser = new User({
            username: user.name,
            email: user.email,
            password: hashedPassword
        });

        try {
            await newUser.save();
            res.status(201).json(newUser);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    public async getUser(req: Request, res: Response): Promise<void> {
        try {
          const userId = req.params.id;
          const user = await User.findById(userId);
          if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
          }
          res.json(user);
        } catch (error) {
          res.status(500).json({ message: 'Error fetching user', error });
        }
      }
}

export default new userController();