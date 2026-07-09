import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentRoutes } from '../routes/payment.routes';
import { PaymentSwagger } from '../swagger/payment.swagger';
import { CreatePaymentUseCase } from '../../application/use_cases/create-payment.use-case';
import { UpdatePaymentUseCase } from '../../application/use_cases/update-payment.use-case';
import { CancelPaymentUseCase } from '../../application/use_cases/cancel-payment.use-case';
import { GetPaymentUseCase } from '../../application/use_cases/get-payment.use-case';
import { CreatePaymentDto } from '../../application/dto/create-payment.dto';
import { UpdatePaymentDto } from '../../application/dto/update-payment.dto';
import { CreatePaymentCommand } from '../../application/commands/create-payment.command';
import { UpdatePaymentCommand } from '../../application/commands/update-payment.command';
import { CancelPaymentCommand } from '../../application/commands/cancel-payment.command';
import { GetPaymentQuery } from '../../application/queries/get-payment.query';

/**
 * REST controller for Payment. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Payment')
@Controller(PaymentRoutes.base)
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
    private readonly cancelPaymentUseCase: CancelPaymentUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
  ) {}

  @Post()
  @ApiOperation(PaymentSwagger.create)
  @ApiResponse({ status: 201, description: 'Payment created.' })
  create(@Body() dto: CreatePaymentDto) {
    return this.createPaymentUseCase.execute(
      new CreatePaymentCommand(
        dto.quoteId,
        dto.orderId,
        dto.payerIdentityId,
        dto.receiverProviderId,
        dto.amount,
        dto.method,
      ),
    );
  }

  @Put(PaymentRoutes.byId)
  @ApiOperation(PaymentSwagger.update)
  @ApiResponse({ status: 200, description: 'Payment updated.' })
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.updatePaymentUseCase.execute(
      new UpdatePaymentCommand(id, dto.status),
    );
  }

  @Put(PaymentRoutes.cancel)
  @ApiOperation(PaymentSwagger.cancel)
  @ApiResponse({ status: 200, description: 'Payment cancelled.' })
  cancel(@Param('id') id: string) {
    return this.cancelPaymentUseCase.execute(new CancelPaymentCommand(id));
  }

  @Get(PaymentRoutes.byId)
  @ApiOperation(PaymentSwagger.get)
  @ApiResponse({ status: 200, description: 'Payment found.' })
  findOne(@Param('id') id: string) {
    return this.getPaymentUseCase.execute(new GetPaymentQuery(id));
  }
}
