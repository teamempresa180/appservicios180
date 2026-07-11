/**
 * Local development seed — synthetic data only, never real user data.
 * Refuses to run against `NODE_ENV=production` as a safety guard.
 *
 * Run with: `npx prisma db seed` (wired via `prisma.seed` in
 * package.json).
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed a production database.');
  }

  const identity = await prisma.identityModel.upsert({
    where: { id: 'seed-identity-1' },
    create: {
      id: 'seed-identity-1',
      fullName: 'Dev Seed User',
      documentType: 'NATIONAL_ID',
      documentNumber: '0000000000',
      birthDate: new Date('1990-01-01'),
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  await prisma.authenticationModel.upsert({
    where: { id: 'seed-authentication-1' },
    create: {
      id: 'seed-authentication-1',
      identityId: identity.id,
      methodType: 'PASSWORD',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  await prisma.credentialModel.upsert({
    where: { id: 'seed-credential-1' },
    create: {
      id: 'seed-credential-1',
      identityId: identity.id,
      type: 'PASSWORD',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  console.log('Seed complete: 1 Identity, 1 Authentication, 1 Credential.');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
