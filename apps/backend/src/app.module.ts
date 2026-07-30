import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './common/logger/logger.module';
import { ObservabilityModule } from './common/observability/observability.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { IdentityPresentationModule } from './modules/identity/presentation/identity.module';
import { ProfilesPresentationModule } from './modules/profiles/presentation/profile.module';
import { AuthenticationPresentationModule } from './modules/authentication/presentation/authentication.module';
import { CredentialsPresentationModule } from './modules/credentials/presentation/credential.module';
import { ContactPresentationModule } from './modules/contact/presentation/contact.module';
import { AddressPresentationModule } from './modules/address/presentation/address.module';
import { ProviderPresentationModule } from './modules/provider/presentation/provider.module';
import { CategoryPresentationModule } from './modules/category/presentation/category.module';
import { ServicePresentationModule } from './modules/service/presentation/service.module';
import { OrderPresentationModule } from './modules/order/presentation/order.module';
import { QuotePresentationModule } from './modules/quote/presentation/quote.module';
import { AvailabilityPresentationModule } from './modules/availability/presentation/availability.module';
import { SchedulePresentationModule } from './modules/schedule/presentation/schedule.module';
import { PaymentPresentationModule } from './modules/payment/presentation/payment.module';
import { NotificationPresentationModule } from './modules/notification/presentation/notification.module';
import { ChatPresentationModule } from './modules/chat/presentation/chat.module';
import { MessagePresentationModule } from './modules/message/presentation/message.module';
import { AttachmentPresentationModule } from './modules/attachment/presentation/attachment.module';
import { ReviewPresentationModule } from './modules/review/presentation/review.module';
import { TrustPresentationModule } from './modules/trust/presentation/trust.module';
import { VerificationPresentationModule } from './modules/verification/presentation/verification.module';
import { AuditPresentationModule } from './modules/audit/presentation/audit.module';

@Module({
  imports: [
    ConfigModule,
    // Global default: 100 requests / 60s per client IP. Sensitive
    // auth endpoints (login/refresh) additionally set a much
    // stricter per-route limit via `@Throttle()` — see
    // `AuthenticationController` — since brute-forcing a password or
    // refresh token is the realistic threat, not general API abuse.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    LoggerModule,
    ObservabilityModule,
    PrismaModule,
    IdentityPresentationModule,
    ProfilesPresentationModule,
    AuthenticationPresentationModule,
    CredentialsPresentationModule,
    ContactPresentationModule,
    AddressPresentationModule,
    ProviderPresentationModule,
    CategoryPresentationModule,
    ServicePresentationModule,
    OrderPresentationModule,
    QuotePresentationModule,
    AvailabilityPresentationModule,
    SchedulePresentationModule,
    PaymentPresentationModule,
    NotificationPresentationModule,
    ChatPresentationModule,
    MessagePresentationModule,
    AttachmentPresentationModule,
    ReviewPresentationModule,
    TrustPresentationModule,
    VerificationPresentationModule,
    AuditPresentationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
