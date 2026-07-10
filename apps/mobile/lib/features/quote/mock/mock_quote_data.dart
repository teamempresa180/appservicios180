import '../../../address/entities/address.dart';
import '../../../address/models/address_id.dart';
import '../../../address/models/address_status.dart';
import '../../../address/models/address_type.dart';
import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';
import '../../../category/models/category_status.dart';
import '../../../category/models/category_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../order/models/order_id.dart';
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

/// Fixed, deterministic mock domain entities for the Quote feature.
/// Intentionally its own set — independent of every other feature's
/// mock data (see the feature README). This feature shows a single,
/// fixed quote — there is no id-based lookup yet.
final Category mockQuoteCategory = Category(
  id: CategoryId.fromString('quote-category-plumbing'),
  name: 'Plomería',
  description: 'Reparación e instalación de tuberías y grifería.',
  icon: 'plumbing',
  color: '#000000',
  status: CategoryStatus.active,
  type: CategoryType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Provider mockQuoteProvider = Provider(
  id: ProviderId.fromString('quote-provider-diana'),
  identityId: IdentityId.fromString('quote-identity-diana'),
  providerProfileId: ProfileId.fromString('quote-profile-diana'),
  status: ProviderStatus.active,
  type: ProviderType.independent,
  experience: ProviderExperience.advanced,
  biography: 'Plomera independiente, especializada en reparaciones '
      'residenciales.',
  yearsOfExperience: 8,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Profile mockQuoteProfile = Profile(
  id: ProfileId.fromString('quote-profile-diana'),
  identityId: IdentityId.fromString('quote-identity-diana'),
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio: mockQuoteProvider.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Service mockQuoteService = Service(
  id: ServiceId.fromString('quote-service-leak-repair'),
  providerId: ProviderId.fromString('quote-provider-diana'),
  categoryId: CategoryId.fromString('quote-category-plumbing'),
  name: 'Reparación de fuga de agua',
  description: 'Diagnóstico y reparación de fugas en tuberías.',
  basePrice: 45,
  estimatedDuration: 60,
  status: ServiceStatus.active,
  type: ServiceType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Address mockQuoteAddress = Address(
  id: AddressId.fromString('quote-address-client'),
  identityId: IdentityId.fromString('quote-identity-client'),
  alias: 'Casa',
  fullAddress: 'Calle 45 # 12-30, Apto 501',
  city: 'Bogotá',
  state: 'Cundinamarca',
  country: 'Colombia',
  postalCode: '110221',
  type: AddressType.home,
  status: AddressStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Quote mockQuote = Quote(
  id: QuoteId.fromString('quote-quote-1'),
  orderId: OrderId.fromString('quote-order-1'),
  providerId: ProviderId.fromString('quote-provider-diana'),
  proposedPrice: 45,
  estimatedDuration: 60,
  notes: 'Incluye revisión general de la tubería y reemplazo de empaques '
      'si es necesario. El precio puede variar si se detectan daños '
      'adicionales durante la visita.',
  status: QuoteStatus.pending,
  type: QuoteType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// Simulated content not modeled by any domain entity — see
/// `QuoteData` and the feature README for why each exists.
const num mockQuoteTravelFee = 5;

const num mockQuoteDiscount = 5;

const num mockQuoteTaxes = 8.55;

final DateTime mockQuoteEstimatedDate = DateTime(2026, 1, 10, 10, 0);
