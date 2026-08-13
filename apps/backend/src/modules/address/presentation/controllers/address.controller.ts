import {
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { AddressRoutes } from '../routes/address.routes';
import { AddressSwagger } from '../swagger/address.swagger';
import { CreateAddressUseCase } from '../../application/use_cases/create-address.use-case';
import { UpdateAddressUseCase } from '../../application/use_cases/update-address.use-case';
import { DeleteAddressUseCase } from '../../application/use_cases/delete-address.use-case';
import { GetAddressUseCase } from '../../application/use_cases/get-address.use-case';
import { ListAddressUseCase } from '../../application/use_cases/list-address.use-case';
import { SearchAddressUseCase } from '../../application/use_cases/search-address.use-case';
import { DeleteAddressCommand } from '../../application/commands/delete-address.command';
import { GetAddressQuery } from '../../application/queries/get-address.query';
import { ListAddressQuery } from '../../application/queries/list-address.query';
import { SearchAddressQuery } from '../../application/queries/search-address.query';
import { CreateAddressRequestDto } from '../dto/create-address.request.dto';
import { UpdateAddressRequestDto } from '../dto/update-address.request.dto';
import { AddressResponseDto } from '../dto/address.response.dto';
import { AddressListResponseDto } from '../dto/address-list.response.dto';
import { AddressHttpMapper } from '../dto/address-http.mapper';

/**
 * REST controller for Address. Only exposes routes, maps HTTP DTOs
 * to Application commands/queries via `AddressHttpMapper`, and
 * delegates to the corresponding Use Case — no business logic lives
 * here. Domain exceptions thrown by Use Cases (`NotFoundException`,
 * `ValidationException`) are translated to HTTP responses by the
 * global `DomainExceptionFilter` (`common/filters/`), registered in
 * `main.ts` — this controller never catches them itself.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /addresses/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 *
 * Every route passes `@CurrentUser()` into its command/query: an
 * Address is personal data, so `list`/`search` are scoped to the
 * caller's own records and the `:id` routes reject Addresses owned by
 * another Identity with 403.
 */
@ApiTags('Address')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(AddressRoutes.base)
export class AddressController {
  constructor(
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly updateAddressUseCase: UpdateAddressUseCase,
    private readonly deleteAddressUseCase: DeleteAddressUseCase,
    private readonly getAddressUseCase: GetAddressUseCase,
    private readonly listAddressUseCase: ListAddressUseCase,
    private readonly searchAddressUseCase: SearchAddressUseCase,
  ) {}

  @Post()
  @ApiOperation(AddressSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Address created.',
    type: AddressResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'The Address belongs to another Identity.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Identity not found.',
    type: ErrorResponseDto,
  })
  async create(
    @CurrentUser() caller: AuthenticatedUser,
    @Body() dto: CreateAddressRequestDto,
  ): Promise<AddressResponseDto> {
    const address = await this.createAddressUseCase.execute(
      AddressHttpMapper.toCreateCommand(caller, dto),
    );
    return AddressHttpMapper.toResponse(address);
  }

  @Put(AddressRoutes.byId)
  @ApiOperation(AddressSwagger.update)
  @ApiParam({ name: 'id', description: 'Address id' })
  @ApiResponse({
    status: 200,
    description: 'Address updated.',
    type: AddressResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'The Address belongs to another Identity.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found.',
    type: ErrorResponseDto,
  })
  async update(
    @CurrentUser() caller: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateAddressRequestDto,
  ): Promise<AddressResponseDto> {
    const address = await this.updateAddressUseCase.execute(
      AddressHttpMapper.toUpdateCommand(caller, id, dto),
    );
    return AddressHttpMapper.toResponse(address);
  }

  @Delete(AddressRoutes.byId)
  @ApiOperation(AddressSwagger.delete)
  @ApiParam({ name: 'id', description: 'Address id' })
  @ApiResponse({ status: 200, description: 'Address deleted.' })
  @ApiResponse({
    status: 403,
    description: 'The Address belongs to another Identity.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found.',
    type: ErrorResponseDto,
  })
  async remove(
    @CurrentUser() caller: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    await this.deleteAddressUseCase.execute(
      new DeleteAddressCommand(caller, id),
    );
  }

  @Get()
  @ApiOperation(AddressSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: "Paginated list of the caller's own Addresses.",
    type: AddressListResponseDto,
  })
  async list(
    @CurrentUser() caller: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<AddressListResponseDto> {
    const query = new ListAddressQuery(
      caller,
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listAddressUseCase.execute(query);
    return AddressHttpMapper.toListResponse(result);
  }

  @Get(AddressRoutes.search)
  @ApiOperation(AddressSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'Bogotá' })
  @ApiResponse({
    status: 200,
    description: "The caller's own Addresses matching the search term.",
    type: [AddressResponseDto],
  })
  async search(
    @CurrentUser() caller: AuthenticatedUser,
    @Query('term') term: string,
  ): Promise<AddressResponseDto[]> {
    const addresses = await this.searchAddressUseCase.execute(
      new SearchAddressQuery(caller, term),
    );
    return addresses.map((address) => AddressHttpMapper.toResponse(address));
  }

  @Get(AddressRoutes.byId)
  @ApiOperation(AddressSwagger.get)
  @ApiParam({ name: 'id', description: 'Address id' })
  @ApiResponse({
    status: 200,
    description: 'Address found.',
    type: AddressResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'The Address belongs to another Identity.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found.',
    type: ErrorResponseDto,
  })
  async findOne(
    @CurrentUser() caller: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<AddressResponseDto> {
    const address = await this.getAddressUseCase.execute(
      new GetAddressQuery(caller, id),
    );
    return AddressHttpMapper.toResponse(address);
  }
}
