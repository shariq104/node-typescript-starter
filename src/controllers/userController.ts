import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/userService';
import { sendSuccess, sendCreated, sendUpdated, sendDeleted, sendPaginatedResponse } from '@/utils/response';
import { handleAsync } from '@/utils/errors';
import { AuthenticatedRequest, UserQuery } from '@/types';

export class UserController {
  // Get all users
  static getUsers = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as UserQuery;
    const result = await UserService.getUsers(query);
    
    sendPaginatedResponse(res, result.users, result.pagination, 'Users retrieved successfully');
  });

  // Get user by ID
  static getUserById = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    
    sendSuccess(res, user, 'User retrieved successfully');
  });

  // Create new user
  static createUser = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const userData = req.body;
    const user = await UserService.createUser(userData);
    
    sendCreated(res, user, 'User created successfully');
  });

  // Update user
  static updateUser = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userData = req.body;
    const user = await UserService.updateUser(id, userData);
    
    sendUpdated(res, user, 'User updated successfully');
  });

  // Delete user
  static deleteUser = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await UserService.deleteUser(id);
    
    sendDeleted(res, 'User deleted successfully');
  });

  // Get current user profile
  static getProfile = handleAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = await UserService.getUserById(req.user!.id);
    
    sendSuccess(res, user, 'Profile retrieved successfully');
  });

  // Update current user profile
  static updateProfile = handleAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.user!;
    const userData = req.body;
    const user = await UserService.updateUser(id, userData);
    
    sendUpdated(res, user, 'Profile updated successfully');
  });

  // Change password
  static changePassword = handleAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.user!;
    const { currentPassword, newPassword } = req.body;
    
    await UserService.changePassword(id, currentPassword, newPassword);
    
    sendSuccess(res, null, 'Password changed successfully');
  });
}
