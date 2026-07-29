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

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock domain entities for the Quote feature.
/// Intentionally its own set — independent of every other feature's
/// mock data (see the feature README). Shows **two** quotes for the
/// same order, from two different providers — the multi-quote,
/// order-scoped shape this feature now models.
final OrderId mockQuoteOrderId = OrderId.fromString('quote-order-1');

final Provider mockQuoteProviderDiana = Provider(
  id: ProviderId.fromString('quote-provider-diana'),
  identityId: IdentityId.fromString('quote-identity-diana'),
  providerProfileId: ProfileId.fromString('quote-profile-diana'),
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

final Profile mockQuoteProfileDiana = Profile(
  id: ProfileId.fromString('quote-profile-diana'),
  identityId: IdentityId.fromString('quote-identity-diana'),
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio: mockQuoteProviderDiana.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Provider mockQuoteProviderCarlos = Provider(
  id: ProviderId.fromString('quote-provider-carlos'),
  identityId: IdentityId.fromString('quote-identity-carlos'),
  providerProfileId: ProfileId.fromString('quote-profile-carlos'),
  status: ProviderStatus.active,
  type: ProviderType.independent,
  experience: ProviderExperience.intermediate,
  biography: 'Plomero independiente, atención rápida en el sector norte.',
  yearsOfExperience: 4,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Profile mockQuoteProfileCarlos = Profile(
  id: ProfileId.fromString('quote-profile-carlos'),
  identityId: IdentityId.fromString('quote-identity-carlos'),
  displayName: 'Carlos Gómez',
  avatarUrl: null,
  bio: mockQuoteProviderCarlos.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Quote mockQuoteFromDiana = Quote(
  id: QuoteId.fromString('quote-quote-diana'),
  orderId: mockQuoteOrderId,
  providerId: mockQuoteProviderDiana.id,
  proposedPrice: 45,
  estimatedDuration: 60,
  notes:
      'Incluye revisión general de la tubería y reemplazo de empaques '
      'si es necesario.',
  status: QuoteStatus.pending,
  type: QuoteType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Quote mockQuoteFromCarlos = Quote(
  id: QuoteId.fromString('quote-quote-carlos'),
  orderId: mockQuoteOrderId,
  providerId: mockQuoteProviderCarlos.id,
  proposedPrice: 38,
  estimatedDuration: 45,
  notes: 'Puedo llegar hoy mismo, precio incluye materiales básicos.',
  status: QuoteStatus.pending,
  type: QuoteType.standard,
  createdAt: _seedTimestamp.add(const Duration(hours: 1)),
  updatedAt: _seedTimestamp.add(const Duration(hours: 1)),
);

final List<Quote> mockQuotes = [mockQuoteFromCarlos, mockQuoteFromDiana];

final Map<ProviderId, Provider> mockQuoteProvidersById = {
  mockQuoteProviderDiana.id: mockQuoteProviderDiana,
  mockQuoteProviderCarlos.id: mockQuoteProviderCarlos,
};

final Map<ProviderId, Profile> mockQuoteProfilesByProviderId = {
  mockQuoteProviderDiana.id: mockQuoteProfileDiana,
  mockQuoteProviderCarlos.id: mockQuoteProfileCarlos,
};
