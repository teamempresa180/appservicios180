import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { AddressType } from '../../domain/value-objects/address-type.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';
import { CreateAddressCommand } from '../commands/create-address.command';
import { DeleteAddressCommand } from '../commands/delete-address.command';
import { UpdateAddressCommand } from '../commands/update-address.command';
import { GetAddressQuery } from '../queries/get-address.query';
import { ListAddressQuery } from '../queries/list-address.query';
import { SearchAddressQuery } from '../queries/search-address.query';
import { InMemoryAddressRepository } from './test-support/in-memory-address.repository';
import { CreateAddressUseCase } from './create-address.use-case';
import { GetAddressUseCase } from './get-address.use-case';
import { UpdateAddressUseCase } from './update-address.use-case';
import { DeleteAddressUseCase } from './delete-address.use-case';
import { ListAddressUseCase } from './list-address.use-case';
import { SearchAddressUseCase } from './search-address.use-case';

describe('Address use cases', () => {
  let repository: InMemoryAddressRepository;
  let identityRepository: InMemoryIdentityRepository;
  let identityId: string;

  beforeEach(async () => {
    repository = new InMemoryAddressRepository();
    identityRepository = new InMemoryIdentityRepository();

    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Owner',
      documentType: DocumentType.NationalId,
      documentNumber: '123',
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id.value;
  });

  function createCommand(
    overrides: Partial<{
      alias: string;
      latitude: number;
      longitude: number;
    }> = {},
  ): CreateAddressCommand {
    return new CreateAddressCommand(
      identityId,
      overrides.alias ?? 'Home',
      'Calle 1 # 2-3',
      'Bogotá',
      'Cundinamarca',
      'Colombia',
      '110111',
      AddressType.Home,
      overrides.latitude,
      overrides.longitude,
    );
  }

  describe('CreateAddressUseCase', () => {
    it('creates an Address in Active status', async () => {
      const useCase = new CreateAddressUseCase(repository, identityRepository);
      const dto = await useCase.execute(createCommand());

      expect(dto.identityId).toBe(identityId);
      expect(dto.alias).toBe('Home');
      expect(dto.status).toBe(AddressStatus.Active);
      expect(dto.latitude).toBeNull();
      expect(dto.longitude).toBeNull();
    });

    it('creates an Address with a map pin when latitude/longitude are provided', async () => {
      const useCase = new CreateAddressUseCase(repository, identityRepository);
      const dto = await useCase.execute(
        createCommand({ latitude: 4.710989, longitude: -74.072092 }),
      );

      expect(dto.latitude).toBe(4.710989);
      expect(dto.longitude).toBe(-74.072092);
    });

    it('rejects a latitude provided without a longitude', async () => {
      const useCase = new CreateAddressUseCase(repository, identityRepository);
      await expect(
        useCase.execute(createCommand({ latitude: 4.710989 })),
      ).rejects.toThrow(ValidationException);
    });

    it('rejects an out-of-range latitude', async () => {
      const useCase = new CreateAddressUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          createCommand({ latitude: 200, longitude: -74.072092 }),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      const useCase = new CreateAddressUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          new CreateAddressCommand(
            'unknown-identity',
            'Home',
            'Calle 1',
            'Bogotá',
            'Cundinamarca',
            'Colombia',
            '110111',
            AddressType.Home,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a blank alias', async () => {
      const useCase = new CreateAddressUseCase(repository, identityRepository);
      await expect(
        useCase.execute(createCommand({ alias: '  ' })),
      ).rejects.toThrow(ValidationException);
    });

    it('rejects an invalid type', async () => {
      const useCase = new CreateAddressUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          new CreateAddressCommand(
            identityId,
            'Home',
            'Calle 1',
            'Bogotá',
            'Cundinamarca',
            'Colombia',
            '110111',
            'NOT_A_TYPE' as AddressType,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetAddressUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetAddressUseCase(repository).execute(
          new GetAddressQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateAddressUseCase', () => {
    it('updates alias, fullAddress and status', async () => {
      const created = await new CreateAddressUseCase(
        repository,
        identityRepository,
      ).execute(createCommand());

      const updated = await new UpdateAddressUseCase(repository).execute(
        new UpdateAddressCommand(
          created.id,
          'Work',
          'Carrera 9 # 10-11',
          AddressStatus.Inactive,
        ),
      );

      expect(updated.alias).toBe('Work');
      expect(updated.fullAddress).toBe('Carrera 9 # 10-11');
      expect(updated.status).toBe(AddressStatus.Inactive);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateAddressUseCase(repository).execute(
          new UpdateAddressCommand('unknown-id', 'Work'),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('sets the map pin when latitude/longitude are provided', async () => {
      const created = await new CreateAddressUseCase(
        repository,
        identityRepository,
      ).execute(createCommand());

      const updated = await new UpdateAddressUseCase(repository).execute(
        new UpdateAddressCommand(
          created.id,
          undefined,
          undefined,
          undefined,
          4.710989,
          -74.072092,
        ),
      );

      expect(updated.latitude).toBe(4.710989);
      expect(updated.longitude).toBe(-74.072092);
    });

    it('leaves the map pin untouched when latitude/longitude are omitted', async () => {
      const created = await new CreateAddressUseCase(
        repository,
        identityRepository,
      ).execute(
        createCommand({ latitude: 4.710989, longitude: -74.072092 }),
      );

      const updated = await new UpdateAddressUseCase(repository).execute(
        new UpdateAddressCommand(created.id, 'Work'),
      );

      expect(updated.latitude).toBe(4.710989);
      expect(updated.longitude).toBe(-74.072092);
    });

    it('clears the map pin when latitude/longitude are explicitly null', async () => {
      const created = await new CreateAddressUseCase(
        repository,
        identityRepository,
      ).execute(
        createCommand({ latitude: 4.710989, longitude: -74.072092 }),
      );

      const updated = await new UpdateAddressUseCase(repository).execute(
        new UpdateAddressCommand(
          created.id,
          undefined,
          undefined,
          undefined,
          null,
          null,
        ),
      );

      expect(updated.latitude).toBeNull();
      expect(updated.longitude).toBeNull();
    });

    it('rejects providing only latitude on update', async () => {
      const created = await new CreateAddressUseCase(
        repository,
        identityRepository,
      ).execute(createCommand());

      await expect(
        new UpdateAddressUseCase(repository).execute(
          new UpdateAddressCommand(
            created.id,
            undefined,
            undefined,
            undefined,
            4.710989,
            undefined,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('DeleteAddressUseCase', () => {
    it('deletes an existing Address', async () => {
      const created = await new CreateAddressUseCase(
        repository,
        identityRepository,
      ).execute(createCommand());

      await new DeleteAddressUseCase(repository).execute(
        new DeleteAddressCommand(created.id),
      );

      await expect(
        new GetAddressUseCase(repository).execute(
          new GetAddressQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteAddressUseCase(repository).execute(
          new DeleteAddressCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListAddressUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateAddressUseCase(
        repository,
        identityRepository,
      );
      await createUseCase.execute(createCommand({ alias: 'A' }));
      await createUseCase.execute(createCommand({ alias: 'B' }));

      const page = await new ListAddressUseCase(repository).execute(
        new ListAddressQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchAddressUseCase', () => {
    it('finds Addresses by alias', async () => {
      await new CreateAddressUseCase(repository, identityRepository).execute(
        createCommand({ alias: 'Special Alias' }),
      );

      const results = await new SearchAddressUseCase(repository).execute(
        new SearchAddressQuery('special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].alias).toBe('Special Alias');
    });
  });
});
