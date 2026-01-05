import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/forbidden-error';
import { UserRole } from '../types/user-role';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = req.currentUser.role;
    
    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenError(
        `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}`
      );
    }

    next();
  };
};

export const requireOrganizer = requireRole(UserRole.ORGANIZER);
export const requireParticipant = requireRole(UserRole.PARTICIPANT);
export const requireAnyRole = requireRole(UserRole.ORGANIZER, UserRole.PARTICIPANT);
