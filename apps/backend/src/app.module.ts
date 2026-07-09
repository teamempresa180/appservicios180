import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  providers: [AppService],
})
export class AppModule {}
