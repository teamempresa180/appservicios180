import { Global, Module } from '@nestjs/common';
import { AppLogger } from './app-logger.service';

/**
 * Global module exposing `AppLogger` app-wide — imported once in
 * `AppModule`, injectable anywhere without re-importing.
 */
@Global()
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
