import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/authService';
import { sendSuccess, sendCreated } from '@/utils/response';
import { handleAsync } from '@/utils/errors';
import { AuthenticatedRequest } from '@/types';

export class AuthController {
  // Register new user
  static register = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const userData = req.body;
    const result = await AuthService.register(userData);
    
    sendCreated(res, {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    }, 'User registered successfully');
  });

  // Login user
  static login = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const credentials = req.body;
    const result = await AuthService.login(credentials);
    
    sendSuccess(res, {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    }, 'Login successful');
  });

  // Refresh access token
  static refreshToken = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshToken(refreshToken);
    
    sendSuccess(res, tokens, 'Token refreshed successfully');
  });

  // Logout user
  static logout = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    
    sendSuccess(res, null, 'Logout successful');
  });

  // Logout from all devices
  static logoutAll = handleAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.user!;
    await AuthService.logoutAllDevices(id);
    
    sendSuccess(res, null, 'Logged out from all devices');
  });

  // Get current user
  static getMe = handleAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = req.user!;
    
    sendSuccess(res, user, 'User retrieved successfully');
  });

  // Verify email
  static verifyEmail = handleAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.user!;
    await AuthService.verifyEmail(id);
    
    sendSuccess(res, null, 'Email verified successfully');
  });

  // Request password reset
  static requestPasswordReset = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await AuthService.requestPasswordReset(email);
    
    sendSuccess(res, null, 'Password reset email sent if account exists');
  });

  // Reset password
  static resetPassword = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, newPassword, resetToken } = req.body;
    await AuthService.resetPassword(email, newPassword, resetToken);
    
    sendSuccess(res, null, 'Password reset successfully');
  });
}
