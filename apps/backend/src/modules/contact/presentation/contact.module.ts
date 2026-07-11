import { Module } from '@nestjs/common';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { ContactController } from './controllers/contact.controller';
import { CreateContactUseCase } from '../application/use_cases/create-contact.use-case';
import { UpdateContactUseCase } from '../application/use_cases/update-contact.use-case';
import { DeleteContactUseCase } from '../application/use_cases/delete-contact.use-case';
import { GetContactUseCase } from '../application/use_cases/get-contact.use-case';
import { ListContactUseCase } from '../application/use_cases/list-contact.use-case';
import { SearchContactUseCase } from '../application/use_cases/search-contact.use-case';
import {
  CONTACT_REPOSITORY,
  ContactRepository,
} from '../domain/interfaces/contact-repository.interface';
import { PrismaContactRepository } from '../infrastructure/persistence/prisma-contact.repository';

/**
 * Wires the Contact presentation layer to its Use Cases, which are
 * wired to the real `PrismaContactRepository` (Sprint 3, Etapa 4) via
 * the `CONTACT_REPOSITORY` DI token — Use Cases depend on the
 * `ContactRepository` interface only, never on `PrismaContactRepository`
 * directly. Imports `IdentityPresentationModule` to get
 * `IDENTITY_REPOSITORY` — `CreateContactUseCase` verifies the
 * referenced Identity exists before creating a contact for it.
 */
@Module({
  imports: [IdentityPresentationModule],
  controllers: [ContactController],
  providers: [
    { provide: CONTACT_REPOSITORY, useClass: PrismaContactRepository },
    {
      provide: CreateContactUseCase,
      useFactory: (
        contactRepo: ContactRepository,
        identityRepo: IdentityRepository,
      ) => new CreateContactUseCase(contactRepo, identityRepo),
      inject: [CONTACT_REPOSITORY, IDENTITY_REPOSITORY],
    },
    {
      provide: UpdateContactUseCase,
      useFactory: (repo: ContactRepository) => new UpdateContactUseCase(repo),
      inject: [CONTACT_REPOSITORY],
    },
    {
      provide: DeleteContactUseCase,
      useFactory: (repo: ContactRepository) => new DeleteContactUseCase(repo),
      inject: [CONTACT_REPOSITORY],
    },
    {
      provide: GetContactUseCase,
      useFactory: (repo: ContactRepository) => new GetContactUseCase(repo),
      inject: [CONTACT_REPOSITORY],
    },
    {
      provide: ListContactUseCase,
      useFactory: (repo: ContactRepository) => new ListContactUseCase(repo),
      inject: [CONTACT_REPOSITORY],
    },
    {
      provide: SearchContactUseCase,
      useFactory: (repo: ContactRepository) => new SearchContactUseCase(repo),
      inject: [CONTACT_REPOSITORY],
    },
  ],
  exports: [CONTACT_REPOSITORY],
})
export class ContactPresentationModule {}
