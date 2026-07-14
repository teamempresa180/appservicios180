import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateAddressCommand } from '../../application/commands/create-address.command';
import { UpdateAddressCommand } from '../../application/commands/update-address.command';
import { AddressDto } from '../../application/dto/address.dto';
import { CreateAddressRequestDto } from './create-address.request.dto';
import { UpdateAddressRequestDto } from './update-address.request.dto';
import { AddressResponseDto } from './address.response.dto';
import { AddressListResponseDto } from './address-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `AddressController` never builds a
 * `CreateAddressCommand` or an `AddressResponseDto` by hand.
 */
export class AddressHttpMapper {
  static toCreateCommand(dto: CreateAddressRequestDto): CreateAddressCommand {
    return new CreateAddressCommand(
      dto.identityId,
      dto.alias,
      dto.fullAddress,
      dto.city,
      dto.state,
      dto.country,
      dto.postalCode,
      dto.type,
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateAddressRequestDto,
  ): UpdateAddressCommand {
    return new UpdateAddressCommand(id, dto.alias, dto.fullAddress, dto.status);
  }

  static toResponse(dto: AddressDto): AddressResponseDto {
    const response = new AddressResponseDto();
    response.id = dto.id;
    response.identityId = dto.identityId;
    response.alias = dto.alias;
    response.fullAddress = dto.fullAddress;
    response.city = dto.city;
    response.state = dto.state;
    response.country = dto.country;
    response.postalCode = dto.postalCode;
    response.type = dto.type;
    response.status = dto.status;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<AddressDto>,
  ): AddressListResponseDto {
    const response = new AddressListResponseDto();
    response.items = result.items.map((item) =>
      AddressHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
