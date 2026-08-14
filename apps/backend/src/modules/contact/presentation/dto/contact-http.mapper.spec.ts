import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ContactDto } from '../../application/dto/contact.dto';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';
import { CreateContactRequestDto } from './create-contact.request.dto';
import { UpdateContactRequestDto } from './update-contact.request.dto';
import { ContactHttpMapper } from './contact-http.mapper';

describe('ContactHttpMapper', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  it('toCreateCommand() carries identityId/type/value through', () => {
    const dto: CreateContactRequestDto = {
      identityId: 'identity-1',
      type: ContactType.Phone,
      value: '+573001234567',
    };

    const command = ContactHttpMapper.toCreateCommand(caller, dto);

    expect(command.identityId).toBe('identity-1');
    expect(command.type).toBe(ContactType.Phone);
    expect(command.value).toBe('+573001234567');
  });

  it('toUpdateCommand() carries the id and optional fields through', () => {
    const dto: UpdateContactRequestDto = { status: ContactStatus.Inactive };

    const command = ContactHttpMapper.toUpdateCommand(caller, 'id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.status).toBe(ContactStatus.Inactive);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: ContactDto = {
      id: 'id-1',
      identityId: 'identity-1',
      type: ContactType.Email,
      value: 'jane.doe@example.com',
      status: ContactStatus.Active,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = ContactHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: ContactDto = {
      id: 'id-1',
      identityId: 'identity-1',
      type: ContactType.Email,
      value: 'jane.doe@example.com',
      status: ContactStatus.Active,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = ContactHttpMapper.toListResponse({
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
