import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * The single `PrismaClient` instance for the whole app — every
 * module's Infrastructure repository injects this instead of
 * instantiating its own client.
 *
 * Deliberately does **not** connect eagerly on `OnModuleInit`: Prisma
 * connects lazily on its first query by default, so the app (and its
 * tests — the e2e test boots the full `AppModule` but never queries
 * Prisma) can start up without a reachable `DATABASE_URL`. Only
 * `onModuleDestroy` disconnects, which is a no-op if a connection was
 * never opened.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
