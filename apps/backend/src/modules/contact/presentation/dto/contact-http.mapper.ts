import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateContactCommand } from '../../application/commands/create-contact.command';
import { UpdateContactCommand } from '../../application/commands/update-contact.command';
import { ContactDto } from '../../application/dto/contact.dto';
import { CreateContactRequestDto } from './create-contact.request.dto';
import { UpdateContactRequestDto } from './update-contact.request.dto';
import { ContactResponseDto } from './contact.response.dto';
import { ContactListResponseDto } from './contact-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `ContactController` never builds a
 * `CreateContactCommand` or a `ContactResponseDto` by hand.
 */
export class ContactHttpMapper {
  static toCreateCommand(dto: CreateContactRequestDto): CreateContactCommand {
    return new CreateContactCommand(dto.identityId, dto.type, dto.value);
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateContactRequestDto,
  ): UpdateContactCommand {
    return new UpdateContactCommand(id, dto.value, dto.status);
  }

  static toResponse(dto: ContactDto): ContactResponseDto {
    const response = new ContactResponseDto();
    response.id = dto.id;
    response.identityId = dto.identityId;
    response.type = dto.type;
    response.value = dto.value;
    response.status = dto.status;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<ContactDto>,
  ): ContactListResponseDto {
    const response = new ContactListResponseDto();
    response.items = result.items.map((item) =>
      ContactHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
