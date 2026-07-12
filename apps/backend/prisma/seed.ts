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

  await prisma.verificationModel.upsert({
    where: { id: 'seed-verification-1' },
    create: {
      id: 'seed-verification-1',
      identityId: identity.id,
      type: 'DOCUMENT',
      status: 'PENDING',
      verifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  await prisma.trustModel.upsert({
    where: { id: 'seed-trust-1' },
    create: {
      id: 'seed-trust-1',
      identityId: identity.id,
      score: 50,
      level: 'MEDIUM',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  await prisma.auditModel.upsert({
    where: { id: 'seed-audit-1' },
    create: {
      id: 'seed-audit-1',
      identityId: identity.id,
      actionType: 'CREATED',
      description: 'Seed data initialized for local development.',
      occurredAt: new Date(),
    },
    update: {},
  });

  const category = await prisma.categoryModel.upsert({
    where: { id: 'seed-category-1' },
    create: {
      id: 'seed-category-1',
      name: 'Plumbing',
      description: 'Pipes and water systems',
      icon: 'icon-plumbing',
      color: '#0000FF',
      status: 'ACTIVE',
      type: 'STANDARD',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  await prisma.serviceModel.upsert({
    where: { id: 'seed-service-1' },
    create: {
      id: 'seed-service-1',
      // Synthetic — the Provider bounded context has no table yet
      // (see PROJECT_STATUS.md, section "Prompt 63").
      providerId: 'seed-provider-1',
      categoryId: category.id,
      name: 'Pipe Repair',
      description: 'Fixes leaking pipes',
      basePrice: 50,
      estimatedDuration: 60,
      status: 'ACTIVE',
      type: 'STANDARD',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  console.log(
    'Seed complete: 1 Identity, 1 Authentication, 1 Credential, 1 Profile, 1 Contact, 1 Address, 1 Verification, 1 Trust, 1 Audit, 1 Category, 1 Service.',
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
