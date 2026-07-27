import { Module } from '@nestjs/common';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { VerificationController } from './controllers/verification.controller';
import { CreateVerificationUseCase } from '../application/use_cases/create-verification.use-case';
import { UpdateVerificationUseCase } from '../application/use_cases/update-verification.use-case';
import { GetVerificationUseCase } from '../application/use_cases/get-verification.use-case';
import { ListVerificationUseCase } from '../application/use_cases/list-verification.use-case';
import { SearchVerificationUseCase } from '../application/use_cases/search-verification.use-case';
import { UploadVerificationDocumentUseCase } from '../application/use_cases/upload-verification-document.use-case';
import {
  VERIFICATION_REPOSITORY,
  VerificationRepository,
} from '../domain/interfaces/verification-repository.interface';
import { PrismaVerificationRepository } from '../infrastructure/persistence/prisma-verification.repository';
import { LocalVerificationDocumentStorageService } from '../infrastructure/storage/local-verification-document-storage.service';

/**
 * Wires the Verification presentation layer to its Use Cases, which
 * are wired to the real `PrismaVerificationRepository` (Sprint 3,
 * Etapa 5) via the `VERIFICATION_REPOSITORY` DI token. Imports
 * `IdentityPresentationModule` to get `IDENTITY_REPOSITORY` —
 * `CreateVerificationUseCase` verifies the referenced Identity exists
 * before creating a record for it.
 */
@Module({
  imports: [IdentityPresentationModule],
  controllers: [VerificationController],
  providers: [
    {
      provide: VERIFICATION_REPOSITORY,
      useClass: PrismaVerificationRepository,
    },
    {
      provide: CreateVerificationUseCase,
      useFactory: (
        verificationRepo: VerificationRepository,
        identityRepo: IdentityRepository,
      ) => new CreateVerificationUseCase(verificationRepo, identityRepo),
      inject: [VERIFICATION_REPOSITORY, IDENTITY_REPOSITORY],
    },
    {
      provide: UpdateVerificationUseCase,
      useFactory: (repo: VerificationRepository) =>
        new UpdateVerificationUseCase(repo),
      inject: [VERIFICATION_REPOSITORY],
    },
    {
      provide: GetVerificationUseCase,
      useFactory: (repo: VerificationRepository) =>
        new GetVerificationUseCase(repo),
      inject: [VERIFICATION_REPOSITORY],
    },
    {
      provide: ListVerificationUseCase,
      useFactory: (repo: VerificationRepository) =>
        new ListVerificationUseCase(repo),
      inject: [VERIFICATION_REPOSITORY],
    },
    {
      provide: SearchVerificationUseCase,
      useFactory: (repo: VerificationRepository) =>
        new SearchVerificationUseCase(repo),
      inject: [VERIFICATION_REPOSITORY],
    },
    {
      provide: UploadVerificationDocumentUseCase,
      useFactory: (repo: VerificationRepository) =>
        new UploadVerificationDocumentUseCase(repo),
      inject: [VERIFICATION_REPOSITORY],
    },
    LocalVerificationDocumentStorageService,
  ],
  exports: [VERIFICATION_REPOSITORY],
})
export class VerificationPresentationModule {}
