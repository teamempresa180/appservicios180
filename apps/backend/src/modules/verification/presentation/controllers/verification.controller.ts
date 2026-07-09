import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerificationRoutes } from '../routes/verification.routes';
import { VerificationSwagger } from '../swagger/verification.swagger';
import { CreateVerificationUseCase } from '../../application/use_cases/create-verification.use-case';
import { UpdateVerificationUseCase } from '../../application/use_cases/update-verification.use-case';
import { GetVerificationUseCase } from '../../application/use_cases/get-verification.use-case';
import { CreateVerificationDto } from '../../application/dto/create-verification.dto';
import { UpdateVerificationDto } from '../../application/dto/update-verification.dto';
import { CreateVerificationCommand } from '../../application/commands/create-verification.command';
import { UpdateVerificationCommand } from '../../application/commands/update-verification.command';
import { GetVerificationQuery } from '../../application/queries/get-verification.query';

/**
 * REST controller for Verification. Only exposes routes and delegates to
 * the corresponding Use Case — no business logic lives here. Use Cases are
 * not implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Verification')
@Controller(VerificationRoutes.base)
export class VerificationController {
  constructor(
    private readonly createVerificationUseCase: CreateVerificationUseCase,
    private readonly updateVerificationUseCase: UpdateVerificationUseCase,
    private readonly getVerificationUseCase: GetVerificationUseCase,
  ) {}

  @Post()
  @ApiOperation(VerificationSwagger.create)
  @ApiResponse({ status: 201, description: 'Verification created.' })
  create(@Body() dto: CreateVerificationDto) {
    return this.createVerificationUseCase.execute(
      new CreateVerificationCommand(dto.identityId, dto.type),
    );
  }

  @Put(VerificationRoutes.byId)
  @ApiOperation(VerificationSwagger.update)
  @ApiResponse({ status: 200, description: 'Verification updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateVerificationDto) {
    return this.updateVerificationUseCase.execute(
      new UpdateVerificationCommand(id, dto.status),
    );
  }

  @Get(VerificationRoutes.byId)
  @ApiOperation(VerificationSwagger.get)
  @ApiResponse({ status: 200, description: 'Verification found.' })
  findOne(@Param('id') id: string) {
    return this.getVerificationUseCase.execute(new GetVerificationQuery(id));
  }
}
