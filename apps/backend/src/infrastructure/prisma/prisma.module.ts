import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global module exposing `PrismaService` app-wide — imported once in
 * `AppModule`, injectable in any module's Infrastructure layer
 * without re-importing.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
