import { Module } from '@nestjs/common';
import { ContactController } from './controllers/contact.controller';
import { CreateContactUseCase } from '../application/use_cases/create-contact.use-case';
import { UpdateContactUseCase } from '../application/use_cases/update-contact.use-case';
import { DeleteContactUseCase } from '../application/use_cases/delete-contact.use-case';
import { GetContactUseCase } from '../application/use_cases/get-contact.use-case';
import { ContactRepository } from '../domain/interfaces/contact-repository.interface';

/**
 * Wires the Contact presentation layer to its Use Cases.
 *
 * No concrete ContactRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [ContactController],
  providers: [
    {
      provide: CreateContactUseCase,
      useFactory: () =>
        new CreateContactUseCase(undefined as unknown as ContactRepository),
    },
    {
      provide: UpdateContactUseCase,
      useFactory: () =>
        new UpdateContactUseCase(undefined as unknown as ContactRepository),
    },
    {
      provide: DeleteContactUseCase,
      useFactory: () =>
        new DeleteContactUseCase(undefined as unknown as ContactRepository),
    },
    {
      provide: GetContactUseCase,
      useFactory: () =>
        new GetContactUseCase(undefined as unknown as ContactRepository),
    },
  ],
})
export class ContactPresentationModule {}
