import '../../../attachment/entities/attachment.dart';
import '../../../attachment/models/attachment_id.dart';
import '../../../attachment/models/attachment_status.dart';
import '../../../attachment/models/attachment_type.dart';
import '../../../category/models/category_id.dart';
import '../../../chat/entities/chat.dart';
import '../../../chat/models/chat_id.dart';
import '../../../chat/models/chat_status.dart';
import '../../../chat/models/chat_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../message/entities/message.dart';
import '../../../message/models/message_id.dart';
import '../../../message/models/message_status.dart';
import '../../../message/models/message_type.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_id.dart';
import '../../../order/models/order_priority.dart';
import '../../../order/models/order_status.dart';
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
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';
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
    providerId: ProviderId.fromString(json['providerId'] as String),
    serviceId: ServiceId.fromString(json['serviceId'] as String),
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
