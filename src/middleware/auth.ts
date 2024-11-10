// FILE: middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { rolePermissions } from '../config/roles';

export const authenticate = passport.authenticate('jwt', { session: false });

export const authorize = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.body.role;
    const userPermissions = rolePermissions[userRole] || [];

    const hasPermission = requiredRoles.every(role =>
      userPermissions.includes(role)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};