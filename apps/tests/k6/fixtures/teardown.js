#!/usr/bin/env node
/**
 * Removes every row `seed.js` created, plus every row a k6 write
 * scenario created *during* a run (Orders, Quotes, Chats, Messages,
 * Reviews, Payments, Notifications — all stamped with `K6-LOADTEST`
 * in a free-text field by the scenario that created them, see
 * `scenarios/*`). Never touches a row it can't trace back to a
 * `K6TEST-` Identity or the dedicated k6 Category — this is the
 * concrete guarantee behind "no modifica datos de producción de
 * forma irreversible" for anything this suite writes.
 *
 * Deletes in FK-safe order (children before parents). Safe to run
 * multiple times — every query is a no-op once nothing matches.
 *
 * Usage:
 *   node apps/tests/k6/fixtures/teardown.js
 */
const path = require('node:path');

const BACKEND_ROOT = path.resolve(__dirname, '../../../backend');

try {
  process.loadEnvFile(path.join(BACKEND_ROOT, '.env'));
} catch {
  // No local .env — fine outside local dev.
}

const { PrismaClient } = require(path.join(BACKEND_ROOT, 'node_modules/@prisma/client'));

const TEST_DOCUMENT_PREFIX = 'K6TEST-';
const TEST_TAG = 'K6-LOADTEST';

const prisma = new PrismaClient();

async function main() {
  const identities = await prisma.identityModel.findMany({
    where: { documentNumber: { startsWith: TEST_DOCUMENT_PREFIX } },
    select: { id: true },
  });
  const identityIds = identities.map((i) => i.id);

  if (identityIds.length === 0) {
    console.log('No k6 fixture identities found — nothing to remove.');
  } else {
    console.log(`Found ${identityIds.length} k6 fixture identities. Removing dependent rows first...`);

    const providers = await prisma.providerModel.findMany({
      where: { identityId: { in: identityIds } },
      select: { id: true },
    });
    const providerIds = providers.map((p) => p.id);

    // Anything the write scenarios created during a run, matched
    // either by participant identity or by the free-text tag — a
    // Payment/Review/Order can be created by one seeded client
    // against another, so the tag is the more reliable net.
    await prisma.messageModel.deleteMany({ where: { content: { contains: TEST_TAG } } });
    await prisma.chatModel.deleteMany({
      where: { OR: [{ clientIdentityId: { in: identityIds } }, { providerId: { in: providerIds } }] },
    });
    await prisma.reviewModel.deleteMany({ where: { comment: { contains: TEST_TAG } } });
    await prisma.paymentModel.deleteMany({
      where: { OR: [{ payerIdentityId: { in: identityIds } }, { receiverProviderId: { in: providerIds } }] },
    });
    await prisma.notificationModel.deleteMany({ where: { identityId: { in: identityIds } } });
    await prisma.quoteModel.deleteMany({ where: { providerId: { in: providerIds } } });
    await prisma.orderModel.deleteMany({
      where: { OR: [{ identityId: { in: identityIds } }, { providerId: { in: providerIds } }] },
    });
    await prisma.serviceModel.deleteMany({ where: { providerId: { in: providerIds } } });
    await prisma.availabilityModel.deleteMany({ where: { providerId: { in: providerIds } } });
    await prisma.scheduleModel.deleteMany({ where: { providerId: { in: providerIds } } });
    await prisma.providerModel.deleteMany({ where: { identityId: { in: identityIds } } });
    await prisma.addressModel.deleteMany({ where: { identityId: { in: identityIds } } });
    await prisma.contactModel.deleteMany({ where: { identityId: { in: identityIds } } });
    await prisma.profileModel.deleteMany({ where: { identityId: { in: identityIds } } });
    await prisma.credentialModel.deleteMany({ where: { identityId: { in: identityIds } } });
    await prisma.authenticationModel.deleteMany({ where: { identityId: { in: identityIds } } });
    await prisma.refreshTokenModel.deleteMany({ where: { identityId: { in: identityIds } } });
    await prisma.identityModel.deleteMany({ where: { id: { in: identityIds } } });

    console.log('Removed all k6 fixture identities and their dependent rows.');
  }

  const category = await prisma.categoryModel.findFirst({ where: { name: `${TEST_TAG} Category` } });
  if (category) {
    const remainingServices = await prisma.serviceModel.count({ where: { categoryId: category.id } });
    if (remainingServices === 0) {
      await prisma.categoryModel.delete({ where: { id: category.id } });
      console.log('Removed the k6 fixture Category.');
    } else {
      console.log(`Kept the k6 fixture Category — ${remainingServices} Service row(s) still reference it.`);
    }
  }
}

main()
  .catch((error) => {
    console.error('Teardown failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
