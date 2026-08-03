import '../../../address/models/address_id.dart';
import '../../../category/models/category_id.dart';
import '../../../identity/models/identity_id.dart';
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
import '../../../service/models/service_id.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

final IdentityId _clientIdentityId = IdentityId.fromString(
  'provider-dashboard-identity-client',
);

/// Address for every mock order below — reuses the Address Management
/// feature's own "Casa" mock id (`address-management-address-home`) so
/// `MockAddressManagementRepository.getAddresses()` actually resolves
/// it, letting the "Iniciar navegación" button always have a real
/// destination in this feature's mock/offline mode.
final AddressId mockDashboardAddressId = AddressId.fromString(
  'address-management-address-home',
);

/// Fixed, deterministic mock domain entities for the Provider Dashboard
/// feature. Intentionally its own set — independent of every other
/// feature's mock data (see the feature README). This feature shows a
/// single, fixed provider's dashboard — there is no id-based lookup
/// yet.
final Provider mockDashboardProvider = Provider(
  id: ProviderId.fromString('provider-dashboard-provider-diana'),
  identityId: IdentityId.fromString('provider-dashboard-identity-diana'),
  providerProfileId: ProfileId.fromString('provider-dashboard-profile-diana'),
  status: ProviderStatus.active,
  type: ProviderType.independent,
  experience: ProviderExperience.advanced,
  biography:
      'Plomera independiente, especializada en reparaciones '
      'residenciales.',
  yearsOfExperience: 8,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Profile mockDashboardProfile = Profile(
  id: ProfileId.fromString('provider-dashboard-profile-diana'),
  identityId: mockDashboardProvider.identityId,
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio: mockDashboardProvider.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Order _orderPending = Order(
  id: OrderId.fromString('provider-dashboard-order-pending'),
  identityId: _clientIdentityId,
  categoryId: CategoryId.fromString('provider-dashboard-category-electrical'),
  providerId: mockDashboardProvider.id,
  serviceId: ServiceId.fromString('provider-dashboard-service-outlet'),
  addressId: mockDashboardAddressId,
  title: 'Instalación de tomacorrientes',
  description: 'Instalación de 3 tomacorrientes nuevos en la sala.',
  scheduledDate: DateTime(2026, 1, 12, 15, 0),
  status: OrderStatus.pending,
  priority: OrderPriority.medium,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Order _orderInProgress = Order(
  id: OrderId.fromString('provider-dashboard-order-in-progress'),
  identityId: _clientIdentityId,
  categoryId: CategoryId.fromString('provider-dashboard-category-plumbing'),
  providerId: mockDashboardProvider.id,
  serviceId: ServiceId.fromString('provider-dashboard-service-leak-repair'),
  addressId: mockDashboardAddressId,
  title: 'Reparación de fuga de agua',
  description: 'Fuga debajo del lavaplatos de la cocina.',
  scheduledDate: DateTime(2026, 1, 10, 10, 0),
  status: OrderStatus.inProgress,
  priority: OrderPriority.high,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Order _orderCompleted1 = Order(
  id: OrderId.fromString('provider-dashboard-order-completed-1'),
  identityId: _clientIdentityId,
  categoryId: CategoryId.fromString('provider-dashboard-category-plumbing'),
  providerId: mockDashboardProvider.id,
  serviceId: ServiceId.fromString('provider-dashboard-service-pipe-install'),
  addressId: mockDashboardAddressId,
  title: 'Instalación de tuberías',
  description: 'Instalación completa de tuberías nuevas en el baño.',
  scheduledDate: DateTime(2026, 1, 8, 9, 0),
  status: OrderStatus.completed,
  priority: OrderPriority.medium,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Order _orderCompleted2 = Order(
  id: OrderId.fromString('provider-dashboard-order-completed-2'),
  identityId: _clientIdentityId,
  categoryId: CategoryId.fromString('provider-dashboard-category-plumbing'),
  providerId: mockDashboardProvider.id,
  serviceId: ServiceId.fromString('provider-dashboard-service-faucet'),
  addressId: mockDashboardAddressId,
  title: 'Instalación de grifería',
  description: 'Instalación de grifos nuevos en la cocina.',
  scheduledDate: DateTime(2026, 1, 5, 16, 0),
  status: OrderStatus.completed,
  priority: OrderPriority.low,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final List<Order> mockDashboardOrders = [
  _orderPending,
  _orderInProgress,
  _orderCompleted1,
  _orderCompleted2,
];

final List<Quote> mockDashboardQuotes = [
  Quote(
    id: QuoteId.fromString('provider-dashboard-quote-1'),
    orderId: _orderPending.id,
    providerId: mockDashboardProvider.id,
    proposedPrice: 35,
    estimatedDuration: 90,
    notes: 'Incluye materiales estándar.',
    status: QuoteStatus.pending,
    type: QuoteType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Quote(
    id: QuoteId.fromString('provider-dashboard-quote-2'),
    orderId: _orderInProgress.id,
    providerId: mockDashboardProvider.id,
    proposedPrice: 45,
    estimatedDuration: 60,
    notes: 'Incluye revisión general de la tubería.',
    status: QuoteStatus.accepted,
    type: QuoteType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

final List<Review> mockDashboardReviews = [
  Review(
    id: ReviewId.fromString('provider-dashboard-review-1'),
    orderId: _orderCompleted1.id,
    providerId: mockDashboardProvider.id,
    reviewerIdentityId: _clientIdentityId,
    rating: const ReviewRating.of(5),
    title: 'Excelente trabajo',
    comment: 'Llegó puntual y solucionó la fuga en menos de una hora.',
    status: ReviewStatus.published,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Review(
    id: ReviewId.fromString('provider-dashboard-review-2'),
    orderId: _orderCompleted2.id,
    providerId: mockDashboardProvider.id,
    reviewerIdentityId: _clientIdentityId,
    rating: const ReviewRating.of(4),
    title: 'Muy buen servicio',
    comment: 'Explicó todo el proceso y dejó el área limpia.',
    status: ReviewStatus.published,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Review(
    id: ReviewId.fromString('provider-dashboard-review-3'),
    orderId: _orderCompleted1.id,
    providerId: mockDashboardProvider.id,
    reviewerIdentityId: _clientIdentityId,
    rating: const ReviewRating.of(5),
    title: 'Recomendada',
    comment: 'Precio justo y trabajo de calidad.',
    status: ReviewStatus.published,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

final List<Payment> mockDashboardPayments = [
  Payment(
    id: PaymentId.fromString('provider-dashboard-payment-1'),
    quoteId: QuoteId.fromString('provider-dashboard-quote-2'),
    orderId: _orderCompleted1.id,
    payerIdentityId: _clientIdentityId,
    receiverProviderId: mockDashboardProvider.id,
    amount: 80,
    method: PaymentMethod.card,
    status: PaymentStatus.completed,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Payment(
    id: PaymentId.fromString('provider-dashboard-payment-2'),
    quoteId: QuoteId.fromString('provider-dashboard-quote-2'),
    orderId: _orderCompleted2.id,
    payerIdentityId: _clientIdentityId,
    receiverProviderId: mockDashboardProvider.id,
    amount: 30,
    method: PaymentMethod.cash,
    status: PaymentStatus.completed,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];
