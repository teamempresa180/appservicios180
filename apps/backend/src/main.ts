import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Order matters for readability, not matching: Nest already picks the
  // most specific @Catch() filter for a given exception regardless of
  // registration order — DomainExceptionFilter only ever sees
  // DomainException, AllExceptionsFilter is the catch-all fallback.
  app.useGlobalFilters(new AllExceptionsFilter(), new DomainExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AppServicios API')
    .setDescription(
      'REST API for AppServicios. Controllers delegate to Application Use Cases, which are backed by real Prisma/PostgreSQL persistence.',
    )
    .setVersion('0.0.1')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        'Access token issued by POST /authentications/login or POST /authentications/refresh.',
    })
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  const config = app.get(ConfigService);
  await app.listen(config.port);
}
void bootstrap();
