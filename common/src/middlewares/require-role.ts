import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/forbidden-error';
import { UserRole } from '../types/user-role';

/**
 * RBAC Middleware - Role-Based Access Control
 * Simple and easy to understand approach for role-based permissions
 * 
 * Usage:
 * - requireRole(UserRole.ORGANIZER) - Only organizers can access
 * - requireRole(UserRole.PARTICIPANT) - Only participants can access
 * - requireRole(UserRole.ORGANIZER, UserRole.PARTICIPANT) - Both can access
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // User must be authenticated first
    if (!req.currentUser) {
      throw new ForbiddenError('Authentication required');
    }

    // Check if user's role is in allowed roles
    const userRole = req.currentUser.role;
    
    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenError(
        `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}`
      );
    }

    next();
  };
};

// Convenience middlewares for common use cases
export const requireOrganizer = requireRole(UserRole.ORGANIZER);
export const requireParticipant = requireRole(UserRole.PARTICIPANT);
export const requireAnyRole = requireRole(UserRole.ORGANIZER, UserRole.PARTICIPANT);
