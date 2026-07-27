import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';
import '../../../category/models/category_status.dart';
import '../../../category/models/category_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_experience.dart';
import '../../../provider/models/provider_id.dart';
import '../../../provider/models/provider_status.dart';
import '../../../provider/models/provider_type.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock domain entities for the Search feature.
/// Intentionally separate from `features/marketplace/mock/` and
/// `features/categories/mock/` — this feature is fully independent
/// (see the feature README).
final List<Category> mockSearchCategories = [
  Category(
    id: CategoryId.fromString('search-category-plumbing'),
    name: 'Plomería',
    description: 'Reparación e instalación de tuberías y grifería.',
    icon: 'plumbing',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Category(
    id: CategoryId.fromString('search-category-electricity'),
    name: 'Electricidad',
    description: 'Instalaciones y reparaciones eléctricas.',
    icon: 'electricity',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Category(
    id: CategoryId.fromString('search-category-cleaning'),
    name: 'Limpieza',
    description: 'Limpieza profunda de hogares y oficinas.',
    icon: 'cleaning',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

final List<Provider> mockSearchProviders = [
  Provider(
    id: ProviderId.fromString('search-provider-diana'),
    identityId: IdentityId.fromString('search-identity-diana'),
    providerProfileId: ProfileId.fromString('search-profile-diana'),
    status: ProviderStatus.active,
    type: ProviderType.independent,
    experience: ProviderExperience.advanced,
    biography:
        'Diana Restrepo — plomera independiente, 8 años de '
        'experiencia en reparaciones residenciales.',
    yearsOfExperience: 8,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Provider(
    id: ProviderId.fromString('search-provider-felipe'),
    identityId: IdentityId.fromString('search-identity-felipe'),
    providerProfileId: ProfileId.fromString('search-profile-felipe'),
    status: ProviderStatus.active,
    type: ProviderType.freelancer,
    experience: ProviderExperience.expert,
    biography:
        'Felipe Cortés — electricista certificado, instalaciones '
        'residenciales y comerciales.',
    yearsOfExperience: 12,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Provider(
    id: ProviderId.fromString('search-provider-marta'),
    identityId: IdentityId.fromString('search-identity-marta'),
    providerProfileId: ProfileId.fromString('search-profile-marta'),
    status: ProviderStatus.active,
    type: ProviderType.company,
    experience: ProviderExperience.intermediate,
    biography:
        'Marta Londoño — equipo de limpieza profesional para '
        'hogares y oficinas.',
    yearsOfExperience: 5,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

final List<Service> mockSearchServices = [
  Service(
    id: ServiceId.fromString('search-service-leak-repair'),
    providerId: ProviderId.fromString('search-provider-diana'),
    categoryId: CategoryId.fromString('search-category-plumbing'),
    name: 'Reparación de fuga de agua',
    description: 'Diagnóstico y reparación de fugas en tuberías.',
    basePrice: 45,
    estimatedDuration: 60,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Service(
    id: ServiceId.fromString('search-service-pipe-install'),
    providerId: ProviderId.fromString('search-provider-diana'),
    categoryId: CategoryId.fromString('search-category-plumbing'),
    name: 'Instalación de tuberías',
    description: 'Instalación completa de tuberías nuevas.',
    basePrice: 80,
    estimatedDuration: 180,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Service(
    id: ServiceId.fromString('search-service-lighting-install'),
    providerId: ProviderId.fromString('search-provider-felipe'),
    categoryId: CategoryId.fromString('search-category-electricity'),
    name: 'Instalación de lámparas',
    description: 'Instalación y cableado de luminarias.',
    basePrice: 35,
    estimatedDuration: 45,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Service(
    id: ServiceId.fromString('search-service-deep-cleaning'),
    providerId: ProviderId.fromString('search-provider-marta'),
    categoryId: CategoryId.fromString('search-category-cleaning'),
    name: 'Limpieza profunda de hogar',
    description: 'Limpieza completa de todas las áreas del hogar.',
    basePrice: 60,
    estimatedDuration: 120,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

/// Rating/reviewsCount, keyed by provider id value — mirrors how
/// `HttpSearchRepository` computes them for real (per-provider, since
/// `Review` links to a `Provider`, not a `Service`). `distance` stays
/// simulated (keyed by service id) — no real geolocation yet.
final Map<String, double> mockSearchRatings = {
  'search-provider-diana': 4.65,
  'search-provider-felipe': 4.9,
  'search-provider-marta': 4.5,
};

final Map<String, int> mockSearchReviewsCount = {
  'search-provider-diana': 50,
  'search-provider-felipe': 47,
  'search-provider-marta': 64,
};

final Map<String, double> mockSearchDistanceKm = {
  'search-service-leak-repair': 2.3,
  'search-service-pipe-install': 2.3,
  'search-service-lighting-install': 5.1,
  'search-service-deep-cleaning': 1.2,
};
