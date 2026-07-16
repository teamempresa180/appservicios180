import { randomUUID } from 'node:crypto';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// Loads `.env` into `process.env` for local/dev runs, exactly like the
// Prisma CLI already does for `prisma migrate`/`prisma studio` — without
// this, `.env` was dev-only decoration: `ConfigService` and Prisma's own
// generated client both read `process.env` directly, so nothing outside
// the Prisma CLI ever saw the file. `loadEnvFile` (stable since Node
// 20.12) avoids adding a `dotenv` dependency. Silently ignored when
// absent (production sets real environment variables instead).
try {
  process.loadEnvFile();
} catch {
  // No .env file — expected in production/CI, where env vars are
  // injected directly.
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Order matters for readability, not matching: Nest already picks the
  // most specific @Catch() filter for a given exception regardless of
  // registration order — DomainExceptionFilter only ever sees
  // DomainException, AllExceptionsFilter is the catch-all fallback.
  app.useGlobalFilters(new AllExceptionsFilter(), new DomainExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS — previously unconfigured (Express/Nest reject cross-origin
  // requests without it), so `'*'` (the default, see `ConfigService.
  // corsOrigin`) preserves the exact prior behavior of accepting any
  // caller; set `CORS_ORIGIN` to a comma-separated allow-list in
  // production to restrict it. No new dependency — built into Nest's
  // Express adapter.
  app.enableCors({ origin: config.corsOrigin });

  // Minimal, dependency-free security headers (Prompt 78, Security
  // Hardening). A `helmet` package would cover more ground, but
  // installing a new dependency is out of scope for this prompt —
  // this covers the same headers manually for the ones that matter
  // most and can't regress anything, since the app has no iframe/MIME
  // -sniffing use case to break.
  app.use(
    (
      _req: unknown,
      res: { setHeader: (name: string, value: string) => void },
      next: () => void,
    ) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('Referrer-Policy', 'no-referrer');
      next();
    },
  );

  // Request ID — a `X-Request-Id` echoed back on every response
  // (reusing the caller's own header if it sent one, so a client-side
  // trace id survives the round trip), for correlating a single
  // request across logs. No new dependency (`crypto.randomUUID` is
  // already used elsewhere, e.g. `jwt-token.service.ts`).
  app.use(
    (
      req: { headers: Record<string, string | string[] | undefined> },
      res: { setHeader: (name: string, value: string) => void },
      next: () => void,
    ) => {
      const incoming = req.headers['x-request-id'];
      const requestId =
        typeof incoming === 'string' && incoming.length > 0
          ? incoming
          : randomUUID();
      res.setHeader('X-Request-Id', requestId);
      next();
    },
  );

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

  await app.listen(config.port);
}
void bootstrap();
