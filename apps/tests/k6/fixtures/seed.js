#!/usr/bin/env node
/**
 * Provisions the fixed, reusable data pool every k6 scenario reads
 * from `data/fixtures.json` — real rows in the target database
 * (Identity/Credential/Authentication/Profile/Address for clients,
 * plus Provider+Service for providers), created once and reused
 * across every run instead of registering fresh throwaway accounts
 * per iteration.
 *
 * Runs directly through Prisma (not the HTTP API) for one specific,
 * deliberate reason: **the Provider fixtures must already be
 * `ProviderStatus.ACTIVE`, and Etapa 19's functional audit confirmed
 * there is no real mechanism to reach that status through the public
 * API** — `Role.Admin` is never issued by anything in this codebase,
 * so `PUT /providers/:id {status: ACTIVE}` is unreachable by any real
 * actor. Seeding directly is the same approach `prisma/seed.ts`
 * already uses for its own demo Provider. Every row this script
 * creates is tagged and namespaced (`K6TEST-` document-number prefix,
 * `K6-LOADTEST` in every free-text field) so `teardown.js` can remove
 * exactly these rows and nothing else — see that file for the
 * matching cleanup query.
 *
 * Usage:
 *   node apps/tests/k6/fixtures/seed.js
 *   K6_SEED_CLIENTS=50 K6_SEED_PROVIDERS=10 node apps/tests/k6/fixtures/seed.js
 *
 * Requires the same `DATABASE_URL` the backend itself uses — reads it
 * from `apps/backend/.env` if present, else from the process
 * environment (exactly how the backend's own `main.ts` resolves it).
 */
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');

const BACKEND_ROOT = path.resolve(__dirname, '../../../backend');

// Mirrors `main.ts`'s own `process.loadEnvFile()` call — local runs
// get `DATABASE_URL` from the backend's .env without needing it
// exported manually; CI/production runs already have it in the
// environment and this is a silent no-op there.
try {
  process.loadEnvFile(path.join(BACKEND_ROOT, '.env'));
} catch {
  // No local .env — fine outside local dev.
}

const { PrismaClient } = require(path.join(BACKEND_ROOT, 'node_modules/@prisma/client'));
const bcrypt = require(path.join(BACKEND_ROOT, 'node_modules/bcryptjs'));

const TEST_DOCUMENT_PREFIX = 'K6TEST-';
const TEST_TAG = 'K6-LOADTEST';
const SALT_ROUNDS = 10; // matches `BcryptPasswordHasher` exactly.
const SEED_CLIENT_COUNT = Number(process.env.K6_SEED_CLIENTS || 20);
const SEED_PROVIDER_COUNT = Number(process.env.K6_SEED_PROVIDERS || 5);
const SERVICES_PER_PROVIDER = 2;
const FIXED_PASSWORD = 'K6-Load-Test-Pass1!';

const prisma = new PrismaClient();

function pad(n) {
  return String(n).padStart(4, '0');
}

function now() {
  return new Date();
}

/** Creates (or reuses) one client Identity with a full, loginable
 *  account: Credential, Authentication, Profile, Address. Idempotent
 *  by `documentNumber` — reruns reuse the same rows instead of
 *  duplicating them. */
async function seedClient(index) {
  const documentNumber = `${TEST_DOCUMENT_PREFIX}CLIENT-${pad(index)}`;
  const existing = await prisma.identityModel.findUnique({ where: { documentNumber } });
  if (existing) {
    const [profile, address] = await Promise.all([
      prisma.profileModel.findFirst({ where: { identityId: existing.id } }),
      prisma.addressModel.findFirst({ where: { identityId: existing.id } }),
    ]);
    return {
      identityId: existing.id,
      documentNumber,
      password: FIXED_PASSWORD,
      profileId: profile.id,
      addressId: address.id,
    };
  }

  const identityId = crypto.randomUUID();
  const profileId = crypto.randomUUID();
  const addressId = crypto.randomUUID();
  const credentialId = crypto.randomUUID();
  const authenticationId = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(FIXED_PASSWORD, SALT_ROUNDS);
  const timestamp = now();

  await prisma.identityModel.create({
    data: {
      id: identityId,
      fullName: `${TEST_TAG} Client ${pad(index)}`,
      documentType: 'NATIONAL_ID',
      documentNumber,
      birthDate: new Date('1990-01-01'),
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
  await prisma.credentialModel.create({
    data: {
      id: credentialId,
      identityId,
      type: 'PASSWORD',
      status: 'ACTIVE',
      passwordHash,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
  await prisma.authenticationModel.create({
    data: {
      id: authenticationId,
      identityId,
      methodType: 'PASSWORD',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
  await prisma.profileModel.create({
    data: {
      id: profileId,
      identityId,
      displayName: `${TEST_TAG} Client ${pad(index)}`,
      bio: TEST_TAG,
      visibility: 'PUBLIC',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
  await prisma.addressModel.create({
    data: {
      id: addressId,
      identityId,
      alias: TEST_TAG,
      fullAddress: 'Calle 100 #10-20',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      latitude: 4.710989,
      longitude: -74.072092,
      type: 'HOME',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });

  return { identityId, documentNumber, password: FIXED_PASSWORD, profileId, addressId };
}

/** Creates (or reuses) one provider Identity, already `ACTIVE`, with
 *  `SERVICES_PER_PROVIDER` real published Services in the shared k6
 *  Category. */
async function seedProvider(index, categoryId) {
  const documentNumber = `${TEST_DOCUMENT_PREFIX}PROVIDER-${pad(index)}`;
  const existing = await prisma.identityModel.findUnique({ where: { documentNumber } });
  if (existing) {
    const provider = await prisma.providerModel.findUnique({ where: { identityId: existing.id } });
    const services = await prisma.serviceModel.findMany({ where: { providerId: provider.id } });
    return {
      identityId: existing.id,
      documentNumber,
      password: FIXED_PASSWORD,
      providerId: provider.id,
      services: services.map((s) => ({
        id: s.id,
        basePrice: s.basePrice,
        estimatedDuration: s.estimatedDuration,
      })),
    };
  }

  const identityId = crypto.randomUUID();
  const profileId = crypto.randomUUID();
  const providerId = crypto.randomUUID();
  const credentialId = crypto.randomUUID();
  const authenticationId = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(FIXED_PASSWORD, SALT_ROUNDS);
  const timestamp = now();

  await prisma.identityModel.create({
    data: {
      id: identityId,
      fullName: `${TEST_TAG} Provider ${pad(index)}`,
      documentType: 'NATIONAL_ID',
      documentNumber,
      birthDate: new Date('1985-01-01'),
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
  await prisma.credentialModel.create({
    data: {
      id: credentialId,
      identityId,
      type: 'PASSWORD',
      status: 'ACTIVE',
      passwordHash,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
  await prisma.authenticationModel.create({
    data: {
      id: authenticationId,
      identityId,
      methodType: 'PASSWORD',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
  await prisma.profileModel.create({
    data: {
      id: profileId,
      identityId,
      displayName: `${TEST_TAG} Provider ${pad(index)}`,
      bio: TEST_TAG,
      visibility: 'PUBLIC',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
  await prisma.providerModel.create({
    data: {
      id: providerId,
      identityId,
      providerProfileId: profileId,
      categoryId,
      status: 'ACTIVE',
      type: 'INDEPENDENT',
      experience: 'ADVANCED',
      biography: TEST_TAG,
      yearsOfExperience: 5,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });

  const services = [];
  for (let s = 0; s < SERVICES_PER_PROVIDER; s += 1) {
    const serviceId = crypto.randomUUID();
    const basePrice = 50 + s * 25;
    const estimatedDuration = 60 + s * 30;
    await prisma.serviceModel.create({
      data: {
        id: serviceId,
        providerId,
        categoryId,
        name: `${TEST_TAG} Service ${pad(index)}-${s}`,
        description: `${TEST_TAG} service fixture for load testing.`,
        basePrice,
        estimatedDuration,
        status: 'ACTIVE',
        type: 'STANDARD',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });
    services.push({ id: serviceId, basePrice, estimatedDuration });
  }

  return { identityId, documentNumber, password: FIXED_PASSWORD, providerId, services };
}

async function seedCategory() {
  const name = `${TEST_TAG} Category`;
  const existing = await prisma.categoryModel.findFirst({ where: { name } });
  if (existing) {
    return { id: existing.id, name: existing.name };
  }
  const id = crypto.randomUUID();
  const timestamp = now();
  await prisma.categoryModel.create({
    data: {
      id,
      name,
      description: `${TEST_TAG} category — dedicated to k6 fixtures, never shown to real users.`,
      icon: 'build',
      color: '#6C63FF',
      status: 'ACTIVE',
      type: 'STANDARD',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
  return { id, name };
}

async function main() {
  console.log(`Seeding k6 fixtures against ${process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1] : '(no DATABASE_URL set)'}`);
  console.log(`Clients: ${SEED_CLIENT_COUNT}  Providers: ${SEED_PROVIDER_COUNT}`);

  const category = await seedCategory();

  const clients = [];
  for (let i = 1; i <= SEED_CLIENT_COUNT; i += 1) {
    clients.push(await seedClient(i));
  }

  const providers = [];
  for (let i = 1; i <= SEED_PROVIDER_COUNT; i += 1) {
    providers.push(await seedProvider(i, category.id));
  }

  const fixtures = {
    category,
    clients,
    providers,
    seededAt: new Date().toISOString(),
  };

  const outPath = path.join(__dirname, '../data/fixtures.json');
  fs.writeFileSync(outPath, JSON.stringify(fixtures, null, 2));
  console.log(`Wrote ${outPath}`);
  console.log(`${clients.length} clients, ${providers.length} providers (${providers.length * SERVICES_PER_PROVIDER} services), 1 category.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
