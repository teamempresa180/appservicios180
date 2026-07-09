import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuoteRoutes } from '../routes/quote.routes';
import { QuoteSwagger } from '../swagger/quote.swagger';
import { CreateQuoteUseCase } from '../../application/use_cases/create-quote.use-case';
import { UpdateQuoteUseCase } from '../../application/use_cases/update-quote.use-case';
import { AcceptQuoteUseCase } from '../../application/use_cases/accept-quote.use-case';
import { RejectQuoteUseCase } from '../../application/use_cases/reject-quote.use-case';
import { GetQuoteUseCase } from '../../application/use_cases/get-quote.use-case';
import { CreateQuoteDto } from '../../application/dto/create-quote.dto';
import { UpdateQuoteDto } from '../../application/dto/update-quote.dto';
import { CreateQuoteCommand } from '../../application/commands/create-quote.command';
import { UpdateQuoteCommand } from '../../application/commands/update-quote.command';
import { AcceptQuoteCommand } from '../../application/commands/accept-quote.command';
import { RejectQuoteCommand } from '../../application/commands/reject-quote.command';
import { GetQuoteQuery } from '../../application/queries/get-quote.query';

/**
 * REST controller for Quote. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Quote')
@Controller(QuoteRoutes.base)
export class QuoteController {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
    private readonly updateQuoteUseCase: UpdateQuoteUseCase,
    private readonly acceptQuoteUseCase: AcceptQuoteUseCase,
    private readonly rejectQuoteUseCase: RejectQuoteUseCase,
    private readonly getQuoteUseCase: GetQuoteUseCase,
  ) {}

  @Post()
  @ApiOperation(QuoteSwagger.create)
  @ApiResponse({ status: 201, description: 'Quote created.' })
  create(@Body() dto: CreateQuoteDto) {
    return this.createQuoteUseCase.execute(
      new CreateQuoteCommand(
        dto.orderId,
        dto.providerId,
        dto.proposedPrice,
        dto.estimatedDuration,
        dto.notes,
        dto.type,
      ),
    );
  }

  @Put(QuoteRoutes.byId)
  @ApiOperation(QuoteSwagger.update)
  @ApiResponse({ status: 200, description: 'Quote updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateQuoteDto) {
    return this.updateQuoteUseCase.execute(
      new UpdateQuoteCommand(
        id,
        dto.proposedPrice,
        dto.estimatedDuration,
        dto.notes,
      ),
    );
  }

  @Put(QuoteRoutes.accept)
  @ApiOperation(QuoteSwagger.accept)
  @ApiResponse({ status: 200, description: 'Quote accepted.' })
  accept(@Param('id') id: string) {
    return this.acceptQuoteUseCase.execute(new AcceptQuoteCommand(id));
  }

  @Put(QuoteRoutes.reject)
  @ApiOperation(QuoteSwagger.reject)
  @ApiResponse({ status: 200, description: 'Quote rejected.' })
  reject(@Param('id') id: string) {
    return this.rejectQuoteUseCase.execute(new RejectQuoteCommand(id));
  }

  @Get(QuoteRoutes.byId)
  @ApiOperation(QuoteSwagger.get)
  @ApiResponse({ status: 200, description: 'Quote found.' })
  findOne(@Param('id') id: string) {
    return this.getQuoteUseCase.execute(new GetQuoteQuery(id));
  }
}
