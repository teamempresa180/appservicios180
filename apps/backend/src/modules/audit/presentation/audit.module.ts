import { Module } from '@nestjs/common';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { AuditController } from './controllers/audit.controller';
import { CreateAuditRecordUseCase } from '../application/use_cases/create-audit-record.use-case';
import { GetAuditUseCase } from '../application/use_cases/get-audit.use-case';
import { ListAuditUseCase } from '../application/use_cases/list-audit.use-case';
import { SearchAuditUseCase } from '../application/use_cases/search-audit.use-case';
import {
  AUDIT_REPOSITORY,
  AuditRepository,
} from '../domain/interfaces/audit-repository.interface';
import { PrismaAuditRepository } from '../infrastructure/persistence/prisma-audit.repository';

/**
 * Wires the Audit presentation layer to its Use Cases, which are
 * wired to the real `PrismaAuditRepository` (Sprint 3, Etapa 5) via
 * the `AUDIT_REPOSITORY` DI token. Imports `IdentityPresentationModule`
 * to get `IDENTITY_REPOSITORY` — `CreateAuditRecordUseCase` verifies
 * the referenced Identity exists before creating a record for it. No
 * Update/Delete use cases — audit records are immutable by design.
 */
@Module({
  imports: [IdentityPresentationModule],
  controllers: [AuditController],
  providers: [
    { provide: AUDIT_REPOSITORY, useClass: PrismaAuditRepository },
    {
      provide: CreateAuditRecordUseCase,
      useFactory: (
        auditRepo: AuditRepository,
        identityRepo: IdentityRepository,
      ) => new CreateAuditRecordUseCase(auditRepo, identityRepo),
      inject: [AUDIT_REPOSITORY, IDENTITY_REPOSITORY],
    },
    {
      provide: GetAuditUseCase,
      useFactory: (repo: AuditRepository) => new GetAuditUseCase(repo),
      inject: [AUDIT_REPOSITORY],
    },
    {
      provide: ListAuditUseCase,
      useFactory: (repo: AuditRepository) => new ListAuditUseCase(repo),
      inject: [AUDIT_REPOSITORY],
    },
    {
      provide: SearchAuditUseCase,
      useFactory: (repo: AuditRepository) => new SearchAuditUseCase(repo),
      inject: [AUDIT_REPOSITORY],
    },
  ],
  exports: [AUDIT_REPOSITORY],
})
export class AuditPresentationModule {}
