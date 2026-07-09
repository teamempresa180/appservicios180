import { Module } from '@nestjs/common';
import { AddressController } from './controllers/address.controller';
import { CreateAddressUseCase } from '../application/use_cases/create-address.use-case';
import { UpdateAddressUseCase } from '../application/use_cases/update-address.use-case';
import { DeleteAddressUseCase } from '../application/use_cases/delete-address.use-case';
import { GetAddressUseCase } from '../application/use_cases/get-address.use-case';
import { AddressRepository } from '../domain/interfaces/address-repository.interface';

/**
 * Wires the Address presentation layer to its Use Cases.
 *
 * No concrete AddressRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [AddressController],
  providers: [
    {
      provide: CreateAddressUseCase,
      useFactory: () =>
        new CreateAddressUseCase(undefined as unknown as AddressRepository),
    },
    {
      provide: UpdateAddressUseCase,
      useFactory: () =>
        new UpdateAddressUseCase(undefined as unknown as AddressRepository),
    },
    {
      provide: DeleteAddressUseCase,
      useFactory: () =>
        new DeleteAddressUseCase(undefined as unknown as AddressRepository),
    },
    {
      provide: GetAddressUseCase,
      useFactory: () =>
        new GetAddressUseCase(undefined as unknown as AddressRepository),
    },
  ],
})
export class AddressPresentationModule {}
