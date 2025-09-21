import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { JwtPayloadWithUser, UserRole } from '@/types';

// Generate access token
export const generateAccessToken = (userId: string, email: string, role: UserRole): string => {
  const payload: JwtPayloadWithUser = {
    userId,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

// Verify access token
export const verifyAccessToken = (token: string): JwtPayloadWithUser => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayloadWithUser;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as { userId: string };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Generate token pair
export const generateTokenPair = (userId: string, email: string, role: UserRole) => {
  return {
    accessToken: generateAccessToken(userId, email, role),
    refreshToken: generateRefreshToken(userId),
  };
};
