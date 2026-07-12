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

  const provider = await prisma.providerModel.upsert({
    where: { id: 'seed-provider-1' },
    create: {
      id: 'seed-provider-1',
      identityId: identity.id,
      providerProfileId: 'seed-profile-1',
      status: 'ACTIVE',
      type: 'INDEPENDENT',
      experience: 'INTERMEDIATE',
      biography: 'Dev seed provider biography.',
      yearsOfExperience: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  await prisma.availabilityModel.upsert({
    where: { id: 'seed-availability-1' },
    create: {
      id: 'seed-availability-1',
      providerId: provider.id,
      status: 'ACTIVE',
      type: 'FULL_TIME',
      availableFrom: new Date('2026-01-01T08:00:00Z'),
      availableTo: new Date('2026-01-01T17:00:00Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {},
  });

  await prisma.scheduleModel.upsert({
    where: { id: 'seed-schedule-1' },
    create: {
      id: 'seed-schedule-1',
      providerId: provider.id,
      startDateTime: new Date('2026-01-01T09:00:00Z'),
      endDateTime: new Date('2026-01-01T10:00:00Z'),
      status: 'OPEN',
      type: 'REGULAR',
      createdAt: new Date(),
      updatedAt: new Date(),
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
      // Real FK now — Provider has a table since Sprint 3, Etapa 7
      // (see PROJECT_STATUS.md, section "Prompt 64").
      providerId: provider.id,
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
    'Seed complete: 1 Identity, 1 Authentication, 1 Credential, 1 Profile, 1 Contact, 1 Address, 1 Verification, 1 Trust, 1 Audit, 1 Provider, 1 Availability, 1 Schedule, 1 Category, 1 Service.',
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
