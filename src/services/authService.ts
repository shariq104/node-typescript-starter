import { UserService } from './userService';
import { generateTokenPair, verifyRefreshToken } from '@/utils/jwt';
import { prisma } from '@/config/database';
import { LoginCredentials, AuthTokens, CreateUserData, UserRole } from '@/types';
import { UnauthorizedError, NotFoundError } from '@/utils/errors';

export class AuthService {
  // Register a new user
  static async register(userData: CreateUserData): Promise<{
    user: Omit<import('@/types').User, 'password'>;
    tokens: AuthTokens;
  }> {
    const user = await UserService.createUser(userData);
    const tokens = generateTokenPair(user.id, user.email, user.role);

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return { user, tokens };
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<{
    user: Omit<import('@/types').User, 'password'>;
    tokens: AuthTokens;
  }> {
    const user = await UserService.verifyCredentials(credentials.email, credentials.password);
    
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const tokens = generateTokenPair(user.id, user.email, user.role);

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      
      // Check if refresh token exists in database
      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: decoded.userId,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (!storedToken) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      if (!storedToken.user.isActive) {
        throw new UnauthorizedError('Account is deactivated');
      }

      // Generate new tokens
      const tokens = generateTokenPair(
        storedToken.user.id,
        storedToken.user.email,
        storedToken.user.role
      );

      // Delete old refresh token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      // Store new refresh token
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: storedToken.user.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  // Logout user
  static async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  // Logout from all devices
  static async logoutAllDevices(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  // Verify email (placeholder - would typically involve sending verification email)
  static async verifyEmail(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  }

  // Request password reset (placeholder - would typically involve sending reset email)
  static async requestPasswordReset(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Store it in database with expiration
    // 3. Send reset email to user
    // For now, we'll just log it
    console.log(`Password reset requested for email: ${email}`);
  }

  // Reset password (placeholder - would typically involve verifying reset token)
  static async resetPassword(email: string, newPassword: string, resetToken: string): Promise<void> {
    // In a real application, you would:
    // 1. Verify the reset token
    // 2. Check if it's not expired
    // 3. Update the password
    // 4. Invalidate the reset token
    // For now, we'll just update the password directly
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { hashPassword } = await import('@/utils/password');
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  }
}
