import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
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
  // `NestExpressApplication` (rather than the default `INestApplication`)
  // is only needed for `useStaticAssets` below — everything else in this
  // file works identically on the plain interface.
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  // Behind Railway's (or any PaaS) reverse proxy, every request arrives
  // from the proxy's own IP unless Express is told to trust its
  // `X-Forwarded-For` header — without this, `ThrottlerGuard` (and any
  // future per-IP logic) would rate-limit the proxy, not real callers.
  // `1` trusts exactly one hop (the platform's edge), which matches how
  // Railway/Render/Fly.io front a single app instance.
  if (config.isProduction) {
    app.set('trust proxy', 1);
  }

  // Order matters for readability, not matching: Nest already picks the
  // most specific @Catch() filter for a given exception regardless of
  // registration order — DomainExceptionFilter only ever sees
  // DomainException, AllExceptionsFilter is the catch-all fallback.
  app.useGlobalFilters(new AllExceptionsFilter(), new DomainExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Rejects any request body field not declared on the target DTO
  // (`whitelist`) rather than silently dropping or passing it through,
  // coerces query/body values to the DTO's declared types (`transform`
  // — this is what lets `@Type(() => Number) page?: number` replace
  // every controller's manual `Number(req.query.page)`), and returns a
  // 400 the instant a `class-validator` decorator fails instead of
  // letting a malformed value reach a use case (Etapa 18 Security
  // Hardening — see each module's DTOs for the actual constraints).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS — set `CORS_ORIGIN` to a comma-separated allow-list; required
  // in production (`env.validation.ts` fails fast otherwise), defaults
  // to `*` outside it for local dev. Only affects browser callers
  // (Swagger UI) — the Flutter app never sends an `Origin` header.
  app.enableCors({ origin: config.corsOrigin });

  // Sets the standard defensive headers (HSTS, CSP, X-Frame-Options,
  // X-Content-Type-Options, etc.) in one call — replaces the three
  // headers this file used to set by hand. `crossOriginResourcePolicy`
  // is relaxed to `cross-origin` because `/uploads/profiles` (avatars)
  // is intentionally served to `<img>` tags from other origins; every
  // other Helmet default is left as-is.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // Serves ONLY avatar images (`uploads/profiles/...`) as public
  // static files — these are meant to be publicly visible profile
  // pictures, the same trust model a CDN would have. Verification
  // documents (national IDs, selfies, certificates) are NOT mounted
  // here: they are sensitive KYC material and are served exclusively
  // through the authenticated, ownership-checked
  // `GET /verifications/:id/document` route (Etapa 18 Security
  // Hardening — see `VerificationController.getDocument`). Previously
  // the entire `uploads/` tree, including verification documents, was
  // mounted here with no authentication at all.
  app.useStaticAssets(join(process.cwd(), 'uploads', 'profiles'), {
    prefix: '/uploads/profiles',
  });

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
      'REST API for AppServicios. Controllers delegate to Application Use Cases, which are backed by real Prisma/MySQL persistence.',
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
