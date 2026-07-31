import '../../../address/entities/address.dart';
import '../../../address/models/address_id.dart';
import '../../../address/models/address_status.dart';
import '../../../address/models/address_type.dart';
import '../../../attachment/entities/attachment.dart';
import '../../../attachment/models/attachment_id.dart';
import '../../../attachment/models/attachment_status.dart';
import '../../../attachment/models/attachment_type.dart';
import '../../../audit/entities/audit.dart';
import '../../../audit/models/audit_action_type.dart';
import '../../../audit/models/audit_id.dart';
import '../../../availability/entities/availability.dart';
import '../../../availability/models/availability_id.dart';
import '../../../availability/models/availability_status.dart';
import '../../../availability/models/availability_type.dart';
import '../../../category/models/category_id.dart';
import '../../../chat/entities/chat.dart';
import '../../../chat/models/chat_id.dart';
import '../../../chat/models/chat_status.dart';
import '../../../chat/models/chat_type.dart';
import '../../../contact/entities/contact.dart';
import '../../../contact/models/contact_id.dart';
import '../../../contact/models/contact_status.dart';
import '../../../contact/models/contact_type.dart';
import '../../../identity/entities/identity.dart';
import '../../../identity/models/document_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../identity/models/identity_status.dart';
import '../../../message/entities/message.dart';
import '../../../message/models/message_id.dart';
import '../../../message/models/message_status.dart';
import '../../../message/models/message_type.dart';
import '../../../notification/entities/notification.dart' as domain;
import '../../../notification/models/notification_id.dart';
import '../../../notification/models/notification_status.dart';
import '../../../notification/models/notification_type.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_id.dart';
import '../../../order/models/order_priority.dart';
import '../../../order/models/order_status.dart';
import '../../../payment/entities/payment.dart';
import '../../../payment/models/payment_id.dart';
import '../../../payment/models/payment_method.dart';
import '../../../payment/models/payment_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../profiles/models/profile_status.dart';
import '../../../profiles/models/profile_visibility.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_experience.dart';
import '../../../provider/models/provider_id.dart';
import '../../../provider/models/provider_status.dart';
import '../../../provider/models/provider_type.dart';
import '../../../quote/entities/quote.dart';
import '../../../quote/models/quote_id.dart';
import '../../../quote/models/quote_status.dart';
import '../../../quote/models/quote_type.dart';
import '../../../review/entities/review.dart';
import '../../../review/models/review_id.dart';
import '../../../review/models/review_rating.dart';
import '../../../review/models/review_status.dart';
import '../../../schedule/entities/schedule.dart';
import '../../../schedule/models/schedule_id.dart';
import '../../../schedule/models/schedule_status.dart';
import '../../../schedule/models/schedule_type.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';
import '../../../trust/entities/trust.dart';
import '../../../trust/models/trust_id.dart';
import '../../../trust/models/trust_level.dart';
import '../../../trust/models/trust_score.dart';
import '../../../trust/models/trust_status.dart';
import '../../../verification/entities/verification.dart';
import '../../../verification/models/verification_id.dart';
import '../../../verification/models/verification_status.dart';
import '../../../verification/models/verification_type.dart';
import 'enum_json.dart';

/// JSON → domain-entity mappers shared by the Orders and Chat pilot
/// repositories (both need Order/Provider/Profile; this avoids
/// duplicating the same mapping logic in two features). Field names
/// mirror the backend's `*ResponseDto` shapes 1:1 — only enum casing
/// differs (bridged by [enumFromJson]).
class OrderHttpMapper {
  static Order fromJson(Map<String, dynamic> json) => Order(
    id: OrderId.fromString(json['id'] as String),
    identityId: IdentityId.fromString(json['identityId'] as String),
    categoryId: CategoryId.fromString(json['categoryId'] as String),
    providerId: json['providerId'] == null
        ? null
        : ProviderId.fromString(json['providerId'] as String),
    serviceId: json['serviceId'] == null
        ? null
        : ServiceId.fromString(json['serviceId'] as String),
    addressId: json['addressId'] == null
        ? null
        : AddressId.fromString(json['addressId'] as String),
    title: json['title'] as String,
    description: json['description'] as String,
    scheduledDate: DateTime.parse(json['scheduledDate'] as String),
    status: OrderStatus.values.byName(enumFromJson(json['status'] as String)),
    priority: OrderPriority.values.byName(
      enumFromJson(json['priority'] as String),
    ),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class ServiceHttpMapper {
  static Service fromJson(Map<String, dynamic> json) => Service(
    id: ServiceId.fromString(json['id'] as String),
    providerId: ProviderId.fromString(json['providerId'] as String),
    categoryId: CategoryId.fromString(json['categoryId'] as String),
    name: json['name'] as String,
    description: json['description'] as String,
    basePrice: json['basePrice'] as num,
    estimatedDuration: json['estimatedDuration'] as int,
    status: ServiceStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    type: ServiceType.values.byName(enumFromJson(json['type'] as String)),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class ProviderHttpMapper {
  static Provider fromJson(Map<String, dynamic> json) => Provider(
    id: ProviderId.fromString(json['id'] as String),
    identityId: IdentityId.fromString(json['identityId'] as String),
    providerProfileId: ProfileId.fromString(
      json['providerProfileId'] as String,
    ),
    status: ProviderStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    type: ProviderType.values.byName(enumFromJson(json['type'] as String)),
    experience: ProviderExperience.values.byName(
      enumFromJson(json['experience'] as String),
    ),
    biography: json['biography'] as String,
    yearsOfExperience: json['yearsOfExperience'] as int,
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class ProfileHttpMapper {
  static Profile fromJson(Map<String, dynamic> json) => Profile(
    id: ProfileId.fromString(json['id'] as String),
    identityId: IdentityId.fromString(json['identityId'] as String),
    displayName: json['displayName'] as String,
    avatarUrl: json['avatarUrl'] as String?,
    bio: json['bio'] as String?,
    visibility: ProfileVisibility.values.byName(
      enumFromJson(json['visibility'] as String),
    ),
    status: ProfileStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class QuoteHttpMapper {
  static Quote fromJson(Map<String, dynamic> json) => Quote(
    id: QuoteId.fromString(json['id'] as String),
    orderId: OrderId.fromString(json['orderId'] as String),
    providerId: ProviderId.fromString(json['providerId'] as String),
    proposedPrice: json['proposedPrice'] as num,
    estimatedDuration: json['estimatedDuration'] as int,
    notes: json['notes'] as String,
    status: QuoteStatus.values.byName(enumFromJson(json['status'] as String)),
    type: QuoteType.values.byName(enumFromJson(json['type'] as String)),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class ChatHttpMapper {
  static Chat fromJson(Map<String, dynamic> json) => Chat(
    id: ChatId.fromString(json['id'] as String),
    orderId: OrderId.fromString(json['orderId'] as String),
    clientIdentityId: IdentityId.fromString(
      json['clientIdentityId'] as String,
    ),
    providerId: ProviderId.fromString(json['providerId'] as String),
    status: ChatStatus.values.byName(enumFromJson(json['status'] as String)),
    type: ChatType.values.byName(enumFromJson(json['type'] as String)),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class MessageHttpMapper {
  static Message fromJson(Map<String, dynamic> json) => Message(
    id: MessageId.fromString(json['id'] as String),
    chatId: ChatId.fromString(json['chatId'] as String),
    senderIdentityId: IdentityId.fromString(
      json['senderIdentityId'] as String,
    ),
    content: json['content'] as String,
    type: MessageType.values.byName(enumFromJson(json['type'] as String)),
    status: MessageStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    sentAt: DateTime.parse(json['sentAt'] as String),
    readAt: json['readAt'] == null
        ? null
        : DateTime.parse(json['readAt'] as String),
  );
}

class AttachmentHttpMapper {
  static Attachment fromJson(Map<String, dynamic> json) => Attachment(
    id: AttachmentId.fromString(json['id'] as String),
    messageId: MessageId.fromString(json['messageId'] as String),
    fileName: json['fileName'] as String,
    mimeType: json['mimeType'] as String,
    fileSize: json['fileSize'] as int,
    type: AttachmentType.values.byName(enumFromJson(json['type'] as String)),
    status: AttachmentStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    createdAt: DateTime.parse(json['createdAt'] as String),
  );
}

class AddressHttpMapper {
  static Address fromJson(Map<String, dynamic> json) => Address(
    id: AddressId.fromString(json['id'] as String),
    identityId: IdentityId.fromString(json['identityId'] as String),
    alias: json['alias'] as String,
    fullAddress: json['fullAddress'] as String,
    city: json['city'] as String,
    state: json['state'] as String,
    country: json['country'] as String,
    postalCode: json['postalCode'] as String,
    type: AddressType.values.byName(enumFromJson(json['type'] as String)),
    status: AddressStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class ContactHttpMapper {
  static Contact fromJson(Map<String, dynamic> json) => Contact(
    id: ContactId.fromString(json['id'] as String),
    identityId: IdentityId.fromString(json['identityId'] as String),
    type: ContactType.values.byName(enumFromJson(json['type'] as String)),
    value: json['value'] as String,
    status: ContactStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class IdentityHttpMapper {
  static Identity fromJson(Map<String, dynamic> json) => Identity(
    id: IdentityId.fromString(json['id'] as String),
    fullName: json['fullName'] as String,
    documentType: DocumentType.values.byName(
      enumFromJson(json['documentType'] as String),
    ),
    documentNumber: json['documentNumber'] as String,
    birthDate: DateTime.parse(json['birthDate'] as String),
    status: IdentityStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class ReviewHttpMapper {
  static Review fromJson(Map<String, dynamic> json) => Review(
    id: ReviewId.fromString(json['id'] as String),
    orderId: OrderId.fromString(json['orderId'] as String),
    providerId: ProviderId.fromString(json['providerId'] as String),
    reviewerIdentityId: IdentityId.fromString(
      json['reviewerIdentityId'] as String,
    ),
    rating: ReviewRating.of(json['rating'] as num),
    title: json['title'] as String,
    comment: json['comment'] as String,
    status: ReviewStatus.values.byName(enumFromJson(json['status'] as String)),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class PaymentHttpMapper {
  static Payment fromJson(Map<String, dynamic> json) => Payment(
    id: PaymentId.fromString(json['id'] as String),
    quoteId: QuoteId.fromString(json['quoteId'] as String),
    orderId: OrderId.fromString(json['orderId'] as String),
    payerIdentityId: IdentityId.fromString(json['payerIdentityId'] as String),
    receiverProviderId: ProviderId.fromString(
      json['receiverProviderId'] as String,
    ),
    amount: json['amount'] as num,
    method: PaymentMethod.values.byName(
      enumFromJson(json['method'] as String),
    ),
    status: PaymentStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class NotificationHttpMapper {
  static domain.Notification fromJson(Map<String, dynamic> json) =>
      domain.Notification(
        id: NotificationId.fromString(json['id'] as String),
        identityId: IdentityId.fromString(json['identityId'] as String),
        title: json['title'] as String,
        body: json['body'] as String,
        type: NotificationType.values.byName(
          enumFromJson(json['type'] as String),
        ),
        status: NotificationStatus.values.byName(
          enumFromJson(json['status'] as String),
        ),
        createdAt: DateTime.parse(json['createdAt'] as String),
        readAt: json['readAt'] == null
            ? null
            : DateTime.parse(json['readAt'] as String),
      );
}

class AvailabilityHttpMapper {
  static Availability fromJson(Map<String, dynamic> json) => Availability(
    id: AvailabilityId.fromString(json['id'] as String),
    providerId: ProviderId.fromString(json['providerId'] as String),
    status: AvailabilityStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    type: AvailabilityType.values.byName(enumFromJson(json['type'] as String)),
    availableFrom: DateTime.parse(json['availableFrom'] as String),
    availableTo: DateTime.parse(json['availableTo'] as String),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class ScheduleHttpMapper {
  static Schedule fromJson(Map<String, dynamic> json) => Schedule(
    id: ScheduleId.fromString(json['id'] as String),
    providerId: ProviderId.fromString(json['providerId'] as String),
    startDateTime: DateTime.parse(json['startDateTime'] as String),
    endDateTime: DateTime.parse(json['endDateTime'] as String),
    status: ScheduleStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    type: ScheduleType.values.byName(enumFromJson(json['type'] as String)),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class TrustHttpMapper {
  static Trust fromJson(Map<String, dynamic> json) => Trust(
    id: TrustId.fromString(json['id'] as String),
    identityId: IdentityId.fromString(json['identityId'] as String),
    score: TrustScore.of(json['score'] as num),
    level: TrustLevel.values.byName(enumFromJson(json['level'] as String)),
    status: TrustStatus.values.byName(enumFromJson(json['status'] as String)),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

class AuditHttpMapper {
  static Audit fromJson(Map<String, dynamic> json) => Audit(
    id: AuditId.fromString(json['id'] as String),
    identityId: IdentityId.fromString(json['identityId'] as String),
    actionType: AuditActionType.values.byName(
      enumFromJson(json['actionType'] as String),
    ),
    description: json['description'] as String,
    occurredAt: DateTime.parse(json['occurredAt'] as String),
  );
}

class VerificationHttpMapper {
  static Verification fromJson(Map<String, dynamic> json) => Verification(
    id: VerificationId.fromString(json['id'] as String),
    identityId: IdentityId.fromString(json['identityId'] as String),
    type: VerificationType.values.byName(
      enumFromJson(json['type'] as String),
    ),
    status: VerificationStatus.values.byName(
      enumFromJson(json['status'] as String),
    ),
    verifiedAt: json['verifiedAt'] == null
        ? null
        : DateTime.parse(json['verifiedAt'] as String),
    createdAt: DateTime.parse(json['createdAt'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
    documentPath: json['documentPath'] as String?,
  );
}
