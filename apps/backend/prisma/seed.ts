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

  await prisma.profileModel.upsert({
    where: { id: 'seed-profile-1' },
    create: {
      id: 'seed-profile-1',
      identityId: identity.id,
      displayName: 'Dev Seed User',
      avatarUrl: null,
      bio: null,
      visibility: 'PUBLIC',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  await prisma.contactModel.upsert({
    where: { id: 'seed-contact-1' },
    create: {
      id: 'seed-contact-1',
      identityId: identity.id,
      type: 'EMAIL',
      value: 'dev.seed.user@example.com',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  await prisma.addressModel.upsert({
    where: { id: 'seed-address-1' },
    create: {
      id: 'seed-address-1',
      identityId: identity.id,
      alias: 'Home',
      fullAddress: 'Calle Falsa 123',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      type: 'HOME',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  console.log(
    'Seed complete: 1 Identity, 1 Authentication, 1 Credential, 1 Profile, 1 Contact, 1 Address.',
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
