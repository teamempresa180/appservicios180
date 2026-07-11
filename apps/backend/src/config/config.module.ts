import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

/**
 * Global module exposing `ConfigService` app-wide — imported once in
 * `AppModule`, injectable anywhere without re-importing.
 */
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
