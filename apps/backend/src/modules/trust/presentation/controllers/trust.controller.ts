import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrustRoutes } from '../routes/trust.routes';
import { TrustSwagger } from '../swagger/trust.swagger';
import { CreateTrustProfileUseCase } from '../../application/use_cases/create-trust-profile.use-case';
import { UpdateTrustProfileUseCase } from '../../application/use_cases/update-trust-profile.use-case';
import { GetTrustUseCase } from '../../application/use_cases/get-trust.use-case';
import { CreateTrustProfileDto } from '../../application/dto/create-trust-profile.dto';
import { UpdateTrustProfileDto } from '../../application/dto/update-trust-profile.dto';
import { CreateTrustProfileCommand } from '../../application/commands/create-trust-profile.command';
import { UpdateTrustProfileCommand } from '../../application/commands/update-trust-profile.command';
import { GetTrustQuery } from '../../application/queries/get-trust.query';

/**
 * REST controller for Trust. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Trust')
@Controller(TrustRoutes.base)
export class TrustController {
  constructor(
    private readonly createTrustProfileUseCase: CreateTrustProfileUseCase,
    private readonly updateTrustProfileUseCase: UpdateTrustProfileUseCase,
    private readonly getTrustUseCase: GetTrustUseCase,
  ) {}

  @Post()
  @ApiOperation(TrustSwagger.create)
  @ApiResponse({ status: 201, description: 'Trust profile created.' })
  create(@Body() dto: CreateTrustProfileDto) {
    return this.createTrustProfileUseCase.execute(
      new CreateTrustProfileCommand(dto.identityId, dto.score, dto.level),
    );
  }

  @Put(TrustRoutes.byId)
  @ApiOperation(TrustSwagger.update)
  @ApiResponse({ status: 200, description: 'Trust profile updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateTrustProfileDto) {
    return this.updateTrustProfileUseCase.execute(
      new UpdateTrustProfileCommand(id, dto.score, dto.level, dto.status),
    );
  }

  @Get(TrustRoutes.byId)
  @ApiOperation(TrustSwagger.get)
  @ApiResponse({ status: 200, description: 'Trust profile found.' })
  findOne(@Param('id') id: string) {
    return this.getTrustUseCase.execute(new GetTrustQuery(id));
  }
}
