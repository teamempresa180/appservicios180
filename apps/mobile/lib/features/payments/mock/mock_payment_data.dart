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
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock domain entities for the Payments feature.
/// Intentionally its own set — independent of every other feature's
/// mock data (see the feature README). This feature shows a single,
/// fixed payment — there is no id-based lookup yet.
final Provider mockPaymentProvider = Provider(
  id: ProviderId.fromString('payments-provider-diana'),
  identityId: IdentityId.fromString('payments-identity-diana'),
  providerProfileId: ProfileId.fromString('payments-profile-diana'),
  status: ProviderStatus.active,
  type: ProviderType.independent,
  experience: ProviderExperience.advanced,
  biography: 'Plomera independiente, especializada en reparaciones '
      'residenciales.',
  yearsOfExperience: 8,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Profile mockPaymentProfile = Profile(
  id: ProfileId.fromString('payments-profile-diana'),
  identityId: IdentityId.fromString('payments-identity-diana'),
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio: mockPaymentProvider.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Service mockPaymentService = Service(
  id: ServiceId.fromString('payments-service-leak-repair'),
  providerId: mockPaymentProvider.id,
  categoryId: CategoryId.fromString('payments-category-plumbing'),
  name: 'Reparación de fuga de agua',
  description: 'Diagnóstico y reparación de fugas en tuberías.',
  basePrice: 45,
  estimatedDuration: 60,
  status: ServiceStatus.active,
  type: ServiceType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Order mockPaymentOrder = Order(
  id: OrderId.fromString('payments-order-1'),
  identityId: IdentityId.fromString('payments-identity-client'),
  providerId: mockPaymentProvider.id,
  serviceId: mockPaymentService.id,
  title: mockPaymentService.name,
  description: 'Fuga debajo del lavaplatos de la cocina.',
  scheduledDate: DateTime(2026, 1, 10, 10, 0),
  status: OrderStatus.completed,
  priority: OrderPriority.medium,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Quote mockPaymentQuote = Quote(
  id: QuoteId.fromString('payments-quote-1'),
  orderId: mockPaymentOrder.id,
  providerId: mockPaymentProvider.id,
  proposedPrice: 45,
  estimatedDuration: 60,
  notes: 'Incluye revisión general de la tubería.',
  status: QuoteStatus.accepted,
  type: QuoteType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Payment mockPayment = Payment(
  id: PaymentId.fromString('payments-payment-1'),
  quoteId: mockPaymentQuote.id,
  orderId: mockPaymentOrder.id,
  payerIdentityId: IdentityId.fromString('payments-identity-client'),
  receiverProviderId: mockPaymentProvider.id,
  amount: 45,
  method: PaymentMethod.card,
  status: PaymentStatus.completed,
  createdAt: DateTime(2026, 1, 10, 11, 15),
  updatedAt: DateTime(2026, 1, 10, 11, 15),
);

/// Simulated content not modeled by any domain entity — see
/// `PaymentDisplay` and the feature README for why each exists.
const String mockPaymentReference = 'TRX-2026-000123';

const String mockPaymentReceiptNumber = 'REC-000456';
