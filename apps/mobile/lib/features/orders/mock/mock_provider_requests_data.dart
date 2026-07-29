import '../../../category/entities/category.dart';
import '../../../identity/models/identity_id.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_id.dart';
import '../../../order/models/order_priority.dart';
import '../../../order/models/order_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../profiles/models/profile_status.dart';
import '../../../profiles/models/profile_visibility.dart';
import '../../../quote/entities/quote.dart';
import '../../../quote/models/quote_id.dart';
import '../../../quote/models/quote_status.dart';
import '../../../quote/models/quote_type.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';
import 'mock_orders_data.dart';

/// Fixed, deterministic mock data for `MockOrdersRepository`'s
/// **provider**-facing methods (`getRelevantOrders`/`getCurrentProvider`/
/// `getMyQuoteFor`/`submitQuote`/`startOrder`/`completeOrder`) — a
/// separate set from [mockOrders] (the *client*-facing "Mis órdenes"
/// fixtures in `mock_orders_data.dart`) so neither feature's tests
/// affect the other's. Reuses [mockOrdersProvider] as "the" logged-in
/// provider (`GET /orders/relevant-for-provider` resolves to a single
/// provider per session, matching this app's single-fixed-provider mock
/// convention everywhere else) and the existing categories, so a mock
/// order's `categoryId` always matches a real `Category`.
final DateTime _seedTimestamp = DateTime(2026, 1, 1);

final OrderId mockProviderRequestDirectPendingId = OrderId.fromString(
  'provider-requests-direct-pending',
);
final OrderId mockProviderRequestDirectQuotedId = OrderId.fromString(
  'provider-requests-direct-quoted',
);
final OrderId mockProviderRequestOpenId = OrderId.fromString(
  'provider-requests-open-pending',
);
final OrderId mockProviderRequestAcceptedId = OrderId.fromString(
  'provider-requests-accepted',
);
final OrderId mockProviderRequestInProgressId = OrderId.fromString(
  'provider-requests-in-progress',
);
final OrderId mockProviderRequestCompletedId = OrderId.fromString(
  'provider-requests-completed',
);

final Profile mockProviderRequestClientProfile = Profile(
  id: ProfileId.fromString('provider-requests-profile-client'),
  identityId: IdentityId.fromString('provider-requests-identity-client'),
  displayName: 'Mateo Salazar',
  avatarUrl: null,
  bio: null,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// A direct hire — the client picked [mockOrdersProvider] by name —
/// still `Pending` and not yet quoted by this provider: needs the
/// "Enviar cotización" action.
final Order mockProviderRequestDirectPending = Order(
  id: mockProviderRequestDirectPendingId,
  identityId: mockProviderRequestClientProfile.identityId,
  categoryId: mockOrdersCategoryPlumbing.id,
  providerId: mockOrdersProvider.id,
  serviceId: ServiceId.fromString('provider-requests-service-direct'),
  title: 'Revisión de calentador de agua',
  description: 'El calentador no enciende desde ayer.',
  scheduledDate: DateTime(2026, 1, 12, 9, 0),
  status: OrderStatus.pending,
  priority: OrderPriority.high,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// A direct hire this provider already quoted — still `Pending` while
/// the client decides: shows "Cotización enviada" instead of the
/// action button.
final Order mockProviderRequestDirectQuoted = Order(
  id: mockProviderRequestDirectQuotedId,
  identityId: mockProviderRequestClientProfile.identityId,
  categoryId: mockOrdersCategoryPlumbing.id,
  providerId: mockOrdersProvider.id,
  serviceId: ServiceId.fromString('provider-requests-service-quoted'),
  title: 'Cambio de llave de paso',
  description: 'Llave de paso principal dañada.',
  scheduledDate: DateTime(2026, 1, 13, 15, 0),
  status: OrderStatus.pending,
  priority: OrderPriority.medium,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// An open request — no provider/service assigned yet — in this
/// provider's own category: any matching provider may quote it.
final Order mockProviderRequestOpen = Order(
  id: mockProviderRequestOpenId,
  identityId: mockProviderRequestClientProfile.identityId,
  categoryId: mockOrdersCategoryPlumbing.id,
  providerId: null,
  serviceId: null,
  title: 'Instalación de lavaplatos nuevo',
  description: 'Necesito instalar un lavaplatos que ya compré.',
  scheduledDate: DateTime(2026, 1, 14, 11, 0),
  status: OrderStatus.pending,
  priority: OrderPriority.low,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// This provider's Quote was accepted: the order is now `Accepted`,
/// awaiting "Comenzar servicio".
final Order mockProviderRequestAccepted = Order(
  id: mockProviderRequestAcceptedId,
  identityId: mockProviderRequestClientProfile.identityId,
  categoryId: mockOrdersCategoryElectrical.id,
  providerId: mockOrdersProvider.id,
  serviceId: ServiceId.fromString('provider-requests-service-accepted'),
  title: 'Instalación de breaker nuevo',
  description: 'Reemplazo del breaker principal del tablero.',
  scheduledDate: DateTime(2026, 1, 15, 10, 0),
  status: OrderStatus.accepted,
  priority: OrderPriority.high,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// Already started: awaiting "Marcar como finalizado".
final Order mockProviderRequestInProgress = Order(
  id: mockProviderRequestInProgressId,
  identityId: mockProviderRequestClientProfile.identityId,
  categoryId: mockOrdersCategoryElectrical.id,
  providerId: mockOrdersProvider.id,
  serviceId: ServiceId.fromString('provider-requests-service-in-progress'),
  title: 'Cableado de oficina',
  description: 'Instalación de cableado eléctrico para 4 puestos.',
  scheduledDate: DateTime(2026, 1, 9, 8, 0),
  status: OrderStatus.inProgress,
  priority: OrderPriority.medium,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// History only — no action left to take.
final Order mockProviderRequestCompleted = Order(
  id: mockProviderRequestCompletedId,
  identityId: mockProviderRequestClientProfile.identityId,
  categoryId: mockOrdersCategoryPlumbing.id,
  providerId: mockOrdersProvider.id,
  serviceId: ServiceId.fromString('provider-requests-service-completed'),
  title: 'Destape de tubería',
  description: 'Destape completo de tubería principal.',
  scheduledDate: DateTime(2026, 1, 3, 13, 0),
  status: OrderStatus.completed,
  priority: OrderPriority.low,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// Every order [MockOrdersRepository.getRelevantOrders] returns.
final List<Order> mockProviderRequestOrders = [
  mockProviderRequestDirectPending,
  mockProviderRequestDirectQuoted,
  mockProviderRequestOpen,
  mockProviderRequestAccepted,
  mockProviderRequestInProgress,
  mockProviderRequestCompleted,
];

final Map<OrderId, Service> mockProviderRequestServices = {
  mockProviderRequestDirectPendingId: Service(
    id: mockProviderRequestDirectPending.serviceId!,
    providerId: mockOrdersProvider.id,
    categoryId: mockOrdersCategoryPlumbing.id,
    name: 'Reparación de calentadores',
    description: 'Diagnóstico y reparación de calentadores de agua.',
    basePrice: 60,
    estimatedDuration: 90,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  mockProviderRequestDirectQuotedId: Service(
    id: mockProviderRequestDirectQuoted.serviceId!,
    providerId: mockOrdersProvider.id,
    categoryId: mockOrdersCategoryPlumbing.id,
    name: 'Cambio de llaves de paso',
    description: 'Reemplazo de llaves de paso residenciales.',
    basePrice: 40,
    estimatedDuration: 60,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  mockProviderRequestAcceptedId: Service(
    id: mockProviderRequestAccepted.serviceId!,
    providerId: mockOrdersProvider.id,
    categoryId: mockOrdersCategoryElectrical.id,
    name: 'Instalación de breakers',
    description: 'Instalación y reemplazo de breakers.',
    basePrice: 70,
    estimatedDuration: 60,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  mockProviderRequestInProgressId: Service(
    id: mockProviderRequestInProgress.serviceId!,
    providerId: mockOrdersProvider.id,
    categoryId: mockOrdersCategoryElectrical.id,
    name: 'Cableado eléctrico',
    description: 'Cableado eléctrico para oficinas y locales.',
    basePrice: 150,
    estimatedDuration: 240,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  mockProviderRequestCompletedId: Service(
    id: mockProviderRequestCompleted.serviceId!,
    providerId: mockOrdersProvider.id,
    categoryId: mockOrdersCategoryPlumbing.id,
    name: 'Destape de tuberías',
    description: 'Destape de tuberías residenciales.',
    basePrice: 50,
    estimatedDuration: 75,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
};

final Map<OrderId, Category> mockProviderRequestCategories = {
  for (final order in mockProviderRequestOrders)
    order.id: order.categoryId == mockOrdersCategoryElectrical.id
        ? mockOrdersCategoryElectrical
        : mockOrdersCategoryPlumbing,
};

final Map<OrderId, Profile> mockProviderRequestClientProfiles = {
  for (final order in mockProviderRequestOrders)
    order.id: mockProviderRequestClientProfile,
};

/// This provider's own Quote for [mockProviderRequestDirectQuoted] —
/// the fixture behind "already quoted, waiting on the client".
final Quote mockProviderRequestExistingQuote = Quote(
  id: QuoteId.fromString('provider-requests-quote-direct-quoted'),
  orderId: mockProviderRequestDirectQuotedId,
  providerId: mockOrdersProvider.id,
  proposedPrice: 40,
  estimatedDuration: 60,
  notes: 'Incluye repuesto e instalación.',
  status: QuoteStatus.pending,
  type: QuoteType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// The accepted Quote behind [mockProviderRequestAccepted] — lets the
/// card show the agreed price even though the order itself carries no
/// price field.
final Quote mockProviderRequestAcceptedQuote = Quote(
  id: QuoteId.fromString('provider-requests-quote-accepted'),
  orderId: mockProviderRequestAcceptedId,
  providerId: mockOrdersProvider.id,
  proposedPrice: 70,
  estimatedDuration: 60,
  notes: 'Incluye breaker nuevo.',
  status: QuoteStatus.accepted,
  type: QuoteType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Quote mockProviderRequestInProgressQuote = Quote(
  id: QuoteId.fromString('provider-requests-quote-in-progress'),
  orderId: mockProviderRequestInProgressId,
  providerId: mockOrdersProvider.id,
  proposedPrice: 150,
  estimatedDuration: 240,
  notes: 'Incluye materiales.',
  status: QuoteStatus.accepted,
  type: QuoteType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Quote mockProviderRequestCompletedQuote = Quote(
  id: QuoteId.fromString('provider-requests-quote-completed'),
  orderId: mockProviderRequestCompletedId,
  providerId: mockOrdersProvider.id,
  proposedPrice: 50,
  estimatedDuration: 75,
  notes: 'Trabajo finalizado sin observaciones.',
  status: QuoteStatus.accepted,
  type: QuoteType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// Seeded quotes this provider has already submitted, keyed by the
/// order they're for — [MockOrdersRepository] copies this into a
/// mutable list so [MockOrdersRepository.submitQuote] can add to it.
final List<Quote> mockProviderRequestQuotes = [
  mockProviderRequestExistingQuote,
  mockProviderRequestAcceptedQuote,
  mockProviderRequestInProgressQuote,
  mockProviderRequestCompletedQuote,
];
