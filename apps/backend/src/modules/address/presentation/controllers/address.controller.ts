import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressRoutes } from '../routes/address.routes';
import { AddressSwagger } from '../swagger/address.swagger';
import { CreateAddressUseCase } from '../../application/use_cases/create-address.use-case';
import { UpdateAddressUseCase } from '../../application/use_cases/update-address.use-case';
import { DeleteAddressUseCase } from '../../application/use_cases/delete-address.use-case';
import { GetAddressUseCase } from '../../application/use_cases/get-address.use-case';
import { CreateAddressDto } from '../../application/dto/create-address.dto';
import { UpdateAddressDto } from '../../application/dto/update-address.dto';
import { CreateAddressCommand } from '../../application/commands/create-address.command';
import { UpdateAddressCommand } from '../../application/commands/update-address.command';
import { DeleteAddressCommand } from '../../application/commands/delete-address.command';
import { GetAddressQuery } from '../../application/queries/get-address.query';

/**
 * REST controller for Address. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Address')
@Controller(AddressRoutes.base)
export class AddressController {
  constructor(
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly updateAddressUseCase: UpdateAddressUseCase,
    private readonly deleteAddressUseCase: DeleteAddressUseCase,
    private readonly getAddressUseCase: GetAddressUseCase,
  ) {}

  @Post()
  @ApiOperation(AddressSwagger.create)
  @ApiResponse({ status: 201, description: 'Address created.' })
  create(@Body() dto: CreateAddressDto) {
    return this.createAddressUseCase.execute(
      new CreateAddressCommand(
        dto.identityId,
        dto.alias,
        dto.fullAddress,
        dto.city,
        dto.state,
        dto.country,
        dto.postalCode,
        dto.type,
      ),
    );
  }

  @Put(AddressRoutes.byId)
  @ApiOperation(AddressSwagger.update)
  @ApiResponse({ status: 200, description: 'Address updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.updateAddressUseCase.execute(
      new UpdateAddressCommand(id, dto.alias, dto.fullAddress, dto.status),
    );
  }

  @Delete(AddressRoutes.byId)
  @ApiOperation(AddressSwagger.delete)
  @ApiResponse({ status: 200, description: 'Address deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteAddressUseCase.execute(new DeleteAddressCommand(id));
  }

  @Get(AddressRoutes.byId)
  @ApiOperation(AddressSwagger.get)
  @ApiResponse({ status: 200, description: 'Address found.' })
  findOne(@Param('id') id: string) {
    return this.getAddressUseCase.execute(new GetAddressQuery(id));
  }
}
