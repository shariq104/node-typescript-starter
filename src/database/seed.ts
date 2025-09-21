import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '@/utils/password';
import { logger } from '@/utils/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('🌱 Starting database seeding...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: await hashPassword('admin123'),
      role: UserRole.ADMIN,
      isActive: true,
      emailVerified: true,
    },
  });

  // Create regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: await hashPassword('user123'),
      role: UserRole.USER,
      isActive: true,
      emailVerified: true,
    },
  });

  // Create moderator user
  const moderatorUser = await prisma.user.upsert({
    where: { email: 'moderator@example.com' },
    update: {},
    create: {
      email: 'moderator@example.com',
      name: 'Moderator User',
      password: await hashPassword('moderator123'),
      role: UserRole.MODERATOR,
      isActive: true,
      emailVerified: true,
    },
  });

  logger.info('✅ Database seeded successfully!');
  logger.info(`👤 Admin user created: ${adminUser.email}`);
  logger.info(`👤 Regular user created: ${regularUser.email}`);
  logger.info(`👤 Moderator user created: ${moderatorUser.email}`);
}

main()
  .catch((e) => {
    logger.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
