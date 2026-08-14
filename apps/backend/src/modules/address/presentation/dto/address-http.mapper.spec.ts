import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { AddressDto } from '../../application/dto/address.dto';
import { AddressType } from '../../domain/value-objects/address-type.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';
import { CreateAddressRequestDto } from './create-address.request.dto';
import { UpdateAddressRequestDto } from './update-address.request.dto';
import { AddressHttpMapper } from './address-http.mapper';

describe('AddressHttpMapper', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  it('toCreateCommand() carries all create fields through', () => {
    const dto: CreateAddressRequestDto = {
      identityId: 'identity-1',
      alias: 'Home',
      fullAddress: 'Calle 123 #45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      type: AddressType.Home,
    };

    const command = AddressHttpMapper.toCreateCommand(caller, dto);

    expect(command.identityId).toBe('identity-1');
    expect(command.alias).toBe('Home');
    expect(command.fullAddress).toBe('Calle 123 #45-67');
    expect(command.city).toBe('Bogotá');
    expect(command.state).toBe('Cundinamarca');
    expect(command.country).toBe('Colombia');
    expect(command.postalCode).toBe('110111');
    expect(command.type).toBe(AddressType.Home);
  });

  it('toUpdateCommand() carries the id and optional fields through', () => {
    const dto: UpdateAddressRequestDto = { status: AddressStatus.Archived };

    const command = AddressHttpMapper.toUpdateCommand(caller, 'id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.status).toBe(AddressStatus.Archived);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: AddressDto = {
      id: 'id-1',
      identityId: 'identity-1',
      alias: 'Home',
      fullAddress: 'Calle 123 #45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      latitude: 4.710989,
      longitude: -74.072092,
      type: AddressType.Home,
      status: AddressStatus.Active,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = AddressHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
    expect(response.latitude).toBe(4.710989);
    expect(response.longitude).toBe(-74.072092);
  });

  it('toCreateCommand() carries an optional latitude/longitude pin through', () => {
    const dto: CreateAddressRequestDto = {
      identityId: 'identity-1',
      alias: 'Home',
      fullAddress: 'Calle 123 #45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      type: AddressType.Home,
      latitude: 4.710989,
      longitude: -74.072092,
    };

    const command = AddressHttpMapper.toCreateCommand(caller, dto);

    expect(command.latitude).toBe(4.710989);
    expect(command.longitude).toBe(-74.072092);
  });

  it('toUpdateCommand() carries latitude/longitude through, including explicit null to clear the pin', () => {
    const dto: UpdateAddressRequestDto = { latitude: null, longitude: null };

    const command = AddressHttpMapper.toUpdateCommand(caller, 'id-1', dto);

    expect(command.latitude).toBeNull();
    expect(command.longitude).toBeNull();
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: AddressDto = {
      id: 'id-1',
      identityId: 'identity-1',
      alias: 'Home',
      fullAddress: 'Calle 123 #45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      latitude: 4.710989,
      longitude: -74.072092,
      type: AddressType.Home,
      status: AddressStatus.Active,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = AddressHttpMapper.toListResponse({
      items: [dto],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toBe('id-1');
    expect(response.total).toBe(1);
  });
});
