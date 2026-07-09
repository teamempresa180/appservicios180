import { Module } from '@nestjs/common';
import { AuditController } from './controllers/audit.controller';
import { CreateAuditRecordUseCase } from '../application/use_cases/create-audit-record.use-case';
import { GetAuditUseCase } from '../application/use_cases/get-audit.use-case';
import { AuditRepository } from '../domain/interfaces/audit-repository.interface';

/**
 * Wires the Audit presentation layer to its Use Cases.
 *
 * No concrete AuditRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [AuditController],
  providers: [
    {
      provide: CreateAuditRecordUseCase,
      useFactory: () =>
        new CreateAuditRecordUseCase(undefined as unknown as AuditRepository),
    },
    {
      provide: GetAuditUseCase,
      useFactory: () =>
        new GetAuditUseCase(undefined as unknown as AuditRepository),
    },
  ],
})
export class AuditPresentationModule {}
