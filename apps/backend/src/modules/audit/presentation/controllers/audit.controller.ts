import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuditRoutes } from '../routes/audit.routes';
import { AuditSwagger } from '../swagger/audit.swagger';
import { CreateAuditRecordUseCase } from '../../application/use_cases/create-audit-record.use-case';
import { GetAuditUseCase } from '../../application/use_cases/get-audit.use-case';
import { CreateAuditRecordDto } from '../../application/dto/create-audit-record.dto';
import { CreateAuditRecordCommand } from '../../application/commands/create-audit-record.command';
import { GetAuditQuery } from '../../application/queries/get-audit.query';

/**
 * REST controller for Audit. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 * There is no update/delete endpoint: audit records are immutable by design.
 */
@ApiTags('Audit')
@Controller(AuditRoutes.base)
export class AuditController {
  constructor(
    private readonly createAuditRecordUseCase: CreateAuditRecordUseCase,
    private readonly getAuditUseCase: GetAuditUseCase,
  ) {}

  @Post()
  @ApiOperation(AuditSwagger.create)
  @ApiResponse({ status: 201, description: 'Audit record created.' })
  create(@Body() dto: CreateAuditRecordDto) {
    return this.createAuditRecordUseCase.execute(
      new CreateAuditRecordCommand(
        dto.identityId,
        dto.actionType,
        dto.description,
      ),
    );
  }

  @Get(AuditRoutes.byId)
  @ApiOperation(AuditSwagger.get)
  @ApiResponse({ status: 200, description: 'Audit record found.' })
  findOne(@Param('id') id: string) {
    return this.getAuditUseCase.execute(new GetAuditQuery(id));
  }
}
