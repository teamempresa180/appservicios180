import '../../../category/models/category_id.dart';
import '../../../chat/entities/chat.dart';
import '../../../chat/models/chat_id.dart';
import '../../../chat/models/chat_status.dart';
import '../../../chat/models/chat_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../notification/entities/notification.dart';
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
import '../../../provider/models/provider_id.dart';
import '../../../quote/entities/quote.dart';
import '../../../quote/models/quote_id.dart';
import '../../../quote/models/quote_status.dart';
import '../../../quote/models/quote_type.dart';
import '../../../service/models/service_id.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed instant used as "now" to derive `timeAgo` — these are fixed
/// mock timestamps, not a live clock (see the feature README).
final DateTime mockNotificationsNow = DateTime(2026, 1, 10, 12, 0);

final IdentityId _clientIdentityId = IdentityId.fromString(
  'notifications-identity-client',
);
final ProviderId _providerId = ProviderId.fromString(
  'notifications-provider-diana',
);

/// Fixed, deterministic mock domain entities for the Notifications
/// feature. Intentionally its own set — independent of every other
/// feature's mock data (see the feature README). Five notifications,
/// one per category the UI needs to distinguish (orden/pago/cotización/
/// mensaje/sistema) — there is no id-based lookup yet.
final Order _order = Order(
  id: OrderId.fromString('notifications-order-1'),
  identityId: _clientIdentityId,
  categoryId: CategoryId.fromString('notifications-category-plumbing'),
  providerId: _providerId,
  serviceId: ServiceId.fromString('notifications-service-1'),
  title: 'Reparación de fuga de agua',
  description: 'Fuga debajo del lavaplatos de la cocina.',
  scheduledDate: DateTime(2026, 1, 10, 10, 0),
  status: OrderStatus.accepted,
  priority: OrderPriority.medium,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Payment _payment = Payment(
  id: PaymentId.fromString('notifications-payment-1'),
  quoteId: QuoteId.fromString('notifications-quote-paid'),
  orderId: OrderId.fromString('notifications-order-paid'),
  payerIdentityId: _clientIdentityId,
  receiverProviderId: _providerId,
  amount: 45,
  method: PaymentMethod.card,
  status: PaymentStatus.completed,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Quote _quote = Quote(
  id: QuoteId.fromString('notifications-quote-1'),
  orderId: OrderId.fromString('notifications-order-quoted'),
  providerId: _providerId,
  proposedPrice: 80,
  estimatedDuration: 180,
  notes: 'Incluye materiales.',
  status: QuoteStatus.pending,
  type: QuoteType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Chat _chat = Chat(
  id: ChatId.fromString('notifications-chat-1'),
  orderId: OrderId.fromString('notifications-order-chat'),
  clientIdentityId: _clientIdentityId,
  providerId: _providerId,
  status: ChatStatus.active,
  type: ChatType.orderRelated,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Notification _orderNotification = Notification(
  id: NotificationId.fromString('notifications-notification-order'),
  identityId: _clientIdentityId,
  title: 'Tu orden fue aceptada',
  body: 'Diana Restrepo aceptó tu solicitud de reparación de fuga de agua.',
  type: NotificationType.info,
  status: NotificationStatus.unread,
  createdAt: DateTime(2026, 1, 10, 11, 45),
  readAt: null,
);

final Notification _paymentNotification = Notification(
  id: NotificationId.fromString('notifications-notification-payment'),
  identityId: _clientIdentityId,
  title: 'Pago completado',
  body: 'Tu pago de \$45 fue procesado exitosamente.',
  type: NotificationType.info,
  status: NotificationStatus.read,
  createdAt: DateTime(2026, 1, 10, 10, 15),
  readAt: DateTime(2026, 1, 10, 10, 20),
);

final Notification _quoteNotification = Notification(
  id: NotificationId.fromString('notifications-notification-quote'),
  identityId: _clientIdentityId,
  title: 'Nueva cotización disponible',
  body: 'Recibiste una cotización de \$80 para instalación de tuberías.',
  type: NotificationType.info,
  status: NotificationStatus.unread,
  createdAt: DateTime(2026, 1, 9, 18, 0),
  readAt: null,
);

final Notification _chatNotification = Notification(
  id: NotificationId.fromString('notifications-notification-chat'),
  identityId: _clientIdentityId,
  title: 'Nuevo mensaje de Diana Restrepo',
  body: 'Llego en unos 15 minutos aproximadamente.',
  type: NotificationType.info,
  status: NotificationStatus.unread,
  createdAt: DateTime(2026, 1, 10, 9, 45),
  readAt: null,
);

final Notification _systemNotification = Notification(
  id: NotificationId.fromString('notifications-notification-system'),
  identityId: _clientIdentityId,
  title: 'Bienvenido a AppServicios',
  body: 'Explora servicios cerca de ti y solicita tu primera reparación.',
  type: NotificationType.system,
  status: NotificationStatus.read,
  createdAt: DateTime(2026, 1, 1, 8, 0),
  readAt: DateTime(2026, 1, 1, 8, 5),
);

final List<Notification> mockNotifications = [
  _orderNotification,
  _paymentNotification,
  _quoteNotification,
  _chatNotification,
  _systemNotification,
];

/// Mock-only, presentation-level pairing between a notification and the
/// real domain entity it relates to — **not** a real domain foreign key
/// (`Notification` has none). See the feature README and
/// `NotificationDisplay`'s class doc.
final Map<NotificationId, Order> mockNotificationOrders = {
  _orderNotification.id: _order,
};

final Map<NotificationId, Payment> mockNotificationPayments = {
  _paymentNotification.id: _payment,
};

final Map<NotificationId, Quote> mockNotificationQuotes = {
  _quoteNotification.id: _quote,
};

final Map<NotificationId, Chat> mockNotificationChats = {
  _chatNotification.id: _chat,
};
