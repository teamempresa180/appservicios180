import { Module } from '@nestjs/common';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { AddressController } from './controllers/address.controller';
import { CreateAddressUseCase } from '../application/use_cases/create-address.use-case';
import { UpdateAddressUseCase } from '../application/use_cases/update-address.use-case';
import { DeleteAddressUseCase } from '../application/use_cases/delete-address.use-case';
import { GetAddressUseCase } from '../application/use_cases/get-address.use-case';
import { ListAddressUseCase } from '../application/use_cases/list-address.use-case';
import { SearchAddressUseCase } from '../application/use_cases/search-address.use-case';
import {
  ADDRESS_REPOSITORY,
  AddressRepository,
} from '../domain/interfaces/address-repository.interface';
import { PrismaAddressRepository } from '../infrastructure/persistence/prisma-address.repository';

/**
 * Wires the Address presentation layer to its Use Cases, which are
 * wired to the real `PrismaAddressRepository` (Sprint 3, Etapa 4) via
 * the `ADDRESS_REPOSITORY` DI token — Use Cases depend on the
 * `AddressRepository` interface only, never on `PrismaAddressRepository`
 * directly. Imports `IdentityPresentationModule` to get
 * `IDENTITY_REPOSITORY` — `CreateAddressUseCase` verifies the
 * referenced Identity exists before creating an address for it.
 */
@Module({
  imports: [IdentityPresentationModule],
  controllers: [AddressController],
  providers: [
    { provide: ADDRESS_REPOSITORY, useClass: PrismaAddressRepository },
    {
      provide: CreateAddressUseCase,
      useFactory: (
        addressRepo: AddressRepository,
        identityRepo: IdentityRepository,
      ) => new CreateAddressUseCase(addressRepo, identityRepo),
      inject: [ADDRESS_REPOSITORY, IDENTITY_REPOSITORY],
    },
    {
      provide: UpdateAddressUseCase,
      useFactory: (repo: AddressRepository) => new UpdateAddressUseCase(repo),
      inject: [ADDRESS_REPOSITORY],
    },
    {
      provide: DeleteAddressUseCase,
      useFactory: (repo: AddressRepository) => new DeleteAddressUseCase(repo),
      inject: [ADDRESS_REPOSITORY],
    },
    {
      provide: GetAddressUseCase,
      useFactory: (repo: AddressRepository) => new GetAddressUseCase(repo),
      inject: [ADDRESS_REPOSITORY],
    },
    {
      provide: ListAddressUseCase,
      useFactory: (repo: AddressRepository) => new ListAddressUseCase(repo),
      inject: [ADDRESS_REPOSITORY],
    },
    {
      provide: SearchAddressUseCase,
      useFactory: (repo: AddressRepository) => new SearchAddressUseCase(repo),
      inject: [ADDRESS_REPOSITORY],
    },
  ],
  exports: [ADDRESS_REPOSITORY],
})
export class AddressPresentationModule {}
