import { Router, Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController';

const router = Router();

// Profile route
router.get('/profile/:id', (req: Request, res: Response, next: NextFunction) => {
  userController.getUser(req, res).catch(next);
})

// Get all users
router.get('/users', (req: Request, res: Response, next: NextFunction) => {
  userController.getUsers(req, res).catch(next);
});

// Get user by ID
router.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  userController.getUser(req, res).catch(next);
});
export default router;
