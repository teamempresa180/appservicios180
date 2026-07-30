import { Logger } from '@nestjs/common';
import { LoggerObservabilityAdapter } from './logger-observability.adapter';

describe('LoggerObservabilityAdapter', () => {
  it('forwards captureEvent to the underlying logger', () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    const adapter = new LoggerObservabilityAdapter();
    adapter.captureEvent({
      message: 'Order created',
      context: 'CreateOrderUseCase',
      metadata: { orderId: 'order-1' },
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Order created'),
      'CreateOrderUseCase',
    );

    logSpy.mockRestore();
  });

  it('forwards captureError with the error stack, without leaking it beyond the log call', () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    const adapter = new LoggerObservabilityAdapter();
    adapter.captureError(new Error('boom'), { message: 'boom', context: 'Test' });

    expect(errorSpy).toHaveBeenCalledWith('boom', expect.any(String), 'Test');

    errorSpy.mockRestore();
  });
});
