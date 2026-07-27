import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';
import '../../../category/models/category_status.dart';
import '../../../category/models/category_type.dart';
import '../../../identity/models/identity_id.dart';
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

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock domain entities for the Orders feature.
/// Intentionally its own set — independent of every other feature's
/// mock data (see the feature README). Unlike other features, this one
/// shows a **list** of orders — one per `OrderStatus` the UI spec
/// explicitly asks to visualize (pending/inProgress/completed/
/// cancelled), each with its own Service/Category/Quote but sharing a
/// single provider ("Diana") for simplicity.
final Provider mockOrdersProvider = Provider(
  id: ProviderId.fromString('orders-provider-diana'),
  identityId: IdentityId.fromString('orders-identity-diana'),
  providerProfileId: ProfileId.fromString('orders-profile-diana'),
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

final Profile mockOrdersProfile = Profile(
  id: ProfileId.fromString('orders-profile-diana'),
  identityId: IdentityId.fromString('orders-identity-diana'),
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio: mockOrdersProvider.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Category mockOrdersCategoryPlumbing = Category(
  id: CategoryId.fromString('orders-category-plumbing'),
  name: 'Plomería',
  description: 'Reparación e instalación de tuberías y grifería.',
  icon: 'plumbing',
  color: '#000000',
  status: CategoryStatus.active,
  type: CategoryType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Category mockOrdersCategoryElectrical = Category(
  id: CategoryId.fromString('orders-category-electrical'),
  name: 'Electricidad',
  description: 'Instalación y reparación de sistemas eléctricos.',
  icon: 'electrical_services',
  color: '#000000',
  status: CategoryStatus.active,
  type: CategoryType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final OrderId _pendingId = OrderId.fromString('orders-order-pending');
final OrderId _inProgressId = OrderId.fromString('orders-order-in-progress');
final OrderId _completedId = OrderId.fromString('orders-order-completed');
final OrderId _cancelledId = OrderId.fromString('orders-order-cancelled');

final Order mockOrderPending = Order(
  id: _pendingId,
  identityId: IdentityId.fromString('orders-identity-client'),
  providerId: mockOrdersProvider.id,
  serviceId: ServiceId.fromString('orders-service-leak-repair'),
  title: 'Reparación de fuga de agua',
  description: 'Fuga debajo del lavaplatos de la cocina.',
  scheduledDate: DateTime(2026, 1, 10, 10, 0),
  status: OrderStatus.pending,
  priority: OrderPriority.medium,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Order mockOrderInProgress = Order(
  id: _inProgressId,
  identityId: IdentityId.fromString('orders-identity-client'),
  providerId: mockOrdersProvider.id,
  serviceId: ServiceId.fromString('orders-service-outlet-install'),
  title: 'Instalación de tomacorrientes',
  description: 'Instalación de 3 tomacorrientes nuevos en la sala.',
  scheduledDate: DateTime(2026, 1, 8, 14, 30),
  status: OrderStatus.inProgress,
  priority: OrderPriority.high,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Order mockOrderCompleted = Order(
  id: _completedId,
  identityId: IdentityId.fromString('orders-identity-client'),
  providerId: mockOrdersProvider.id,
  serviceId: ServiceId.fromString('orders-service-pipe-install'),
  title: 'Instalación de tuberías',
  description: 'Instalación completa de tuberías nuevas en el baño.',
  scheduledDate: DateTime(2026, 1, 2, 9, 0),
  status: OrderStatus.completed,
  priority: OrderPriority.medium,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Order mockOrderCancelled = Order(
  id: _cancelledId,
  identityId: IdentityId.fromString('orders-identity-client'),
  providerId: mockOrdersProvider.id,
  serviceId: ServiceId.fromString('orders-service-faucet-install'),
  title: 'Instalación de grifería',
  description: 'Instalación de grifos nuevos en la cocina.',
  scheduledDate: DateTime(2026, 1, 5, 16, 0),
  status: OrderStatus.cancelled,
  priority: OrderPriority.low,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final List<Order> mockOrders = [
  mockOrderPending,
  mockOrderInProgress,
  mockOrderCompleted,
  mockOrderCancelled,
];

final Map<OrderId, Service> mockOrderServices = {
  _pendingId: Service(
    id: ServiceId.fromString('orders-service-leak-repair'),
    providerId: mockOrdersProvider.id,
    categoryId: mockOrdersCategoryPlumbing.id,
    name: 'Reparación de fuga de agua',
    description: 'Diagnóstico y reparación de fugas en tuberías.',
    basePrice: 45,
    estimatedDuration: 60,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _inProgressId: Service(
    id: ServiceId.fromString('orders-service-outlet-install'),
    providerId: mockOrdersProvider.id,
    categoryId: mockOrdersCategoryElectrical.id,
    name: 'Instalación de tomacorrientes',
    description: 'Instalación de tomacorrientes nuevos.',
    basePrice: 35,
    estimatedDuration: 90,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _completedId: Service(
    id: ServiceId.fromString('orders-service-pipe-install'),
    providerId: mockOrdersProvider.id,
    categoryId: mockOrdersCategoryPlumbing.id,
    name: 'Instalación de tuberías',
    description: 'Instalación completa de tuberías nuevas.',
    basePrice: 80,
    estimatedDuration: 180,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _cancelledId: Service(
    id: ServiceId.fromString('orders-service-faucet-install'),
    providerId: mockOrdersProvider.id,
    categoryId: mockOrdersCategoryPlumbing.id,
    name: 'Instalación de grifería',
    description: 'Instalación de grifos y llaves de paso.',
    basePrice: 30,
    estimatedDuration: 45,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
};

final Map<OrderId, Provider> mockOrderProviders = {
  for (final order in mockOrders) order.id: mockOrdersProvider,
};

final Map<OrderId, Profile> mockOrderProfiles = {
  for (final order in mockOrders) order.id: mockOrdersProfile,
};

/// The client who placed the order — distinct from [mockOrdersProfile]
/// (the provider's own profile, already exposed via
/// `getProfileFor`/[mockOrderProfiles]). Backs the provider-facing
/// "Servicios" screen (incoming requests), which needs to show *who is
/// asking*, not the provider's own name.
final Profile mockOrdersClientProfile = Profile(
  id: ProfileId.fromString('orders-profile-client'),
  identityId: IdentityId.fromString('orders-identity-client'),
  displayName: 'Laura Gómez',
  avatarUrl: null,
  bio: null,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Map<OrderId, Profile> mockOrderClientProfiles = {
  for (final order in mockOrders) order.id: mockOrdersClientProfile,
};

final Map<OrderId, Category> mockOrderCategories = {
  _pendingId: mockOrdersCategoryPlumbing,
  _inProgressId: mockOrdersCategoryElectrical,
  _completedId: mockOrdersCategoryPlumbing,
  _cancelledId: mockOrdersCategoryPlumbing,
};

final Map<OrderId, Quote> mockOrderQuotes = {
  _pendingId: Quote(
    id: QuoteId.fromString('orders-quote-pending'),
    orderId: _pendingId,
    providerId: mockOrdersProvider.id,
    proposedPrice: 45,
    estimatedDuration: 60,
    notes: 'Incluye revisión general de la tubería.',
    status: QuoteStatus.pending,
    type: QuoteType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _inProgressId: Quote(
    id: QuoteId.fromString('orders-quote-in-progress'),
    orderId: _inProgressId,
    providerId: mockOrdersProvider.id,
    proposedPrice: 35,
    estimatedDuration: 90,
    notes: 'Incluye materiales estándar.',
    status: QuoteStatus.accepted,
    type: QuoteType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _completedId: Quote(
    id: QuoteId.fromString('orders-quote-completed'),
    orderId: _completedId,
    providerId: mockOrdersProvider.id,
    proposedPrice: 80,
    estimatedDuration: 180,
    notes: 'Trabajo finalizado sin observaciones.',
    status: QuoteStatus.accepted,
    type: QuoteType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _cancelledId: Quote(
    id: QuoteId.fromString('orders-quote-cancelled'),
    orderId: _cancelledId,
    providerId: mockOrdersProvider.id,
    proposedPrice: 30,
    estimatedDuration: 45,
    notes: 'Cotización cancelada por el cliente.',
    status: QuoteStatus.withdrawn,
    type: QuoteType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
};

/// Simulated content not modeled by any domain entity — see
/// `OrderDisplay` and the feature README for why it exists.
final Map<OrderId, String> mockOrderEstimatedArrival = {
  _pendingId: 'Por confirmar',
  _inProgressId: 'Llega en 20 min',
  _completedId: 'Servicio finalizado',
  _cancelledId: 'No aplica',
};
