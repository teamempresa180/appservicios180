import '../../../availability/entities/availability.dart';
import '../../../availability/models/availability_id.dart';
import '../../../availability/models/availability_status.dart';
import '../../../availability/models/availability_type.dart';
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
import '../../../review/entities/review.dart';
import '../../../review/models/review_id.dart';
import '../../../review/models/review_rating.dart';
import '../../../review/models/review_status.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock domain entities for the Provider Profile
/// feature. Intentionally its own set — independent of every other
/// feature's mock data (see the feature README). This feature shows a
/// single, fixed provider — there is no id-based lookup yet.
final List<Category> mockProviderProfileCategories = [
  Category(
    id: CategoryId.fromString('provider-profile-category-plumbing'),
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
    id: CategoryId.fromString('provider-profile-category-installations'),
    name: 'Instalaciones generales',
    description: 'Instalación de equipos y accesorios del hogar.',
    icon: 'construction',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

final Provider mockProviderProfileProvider = Provider(
  id: ProviderId.fromString('provider-profile-provider-diana'),
  identityId: IdentityId.fromString('provider-profile-identity-diana'),
  providerProfileId: ProfileId.fromString('provider-profile-profile-diana'),
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

final Profile mockProviderProfileProfile = Profile(
  id: ProfileId.fromString('provider-profile-profile-diana'),
  identityId: IdentityId.fromString('provider-profile-identity-diana'),
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio: mockProviderProfileProvider.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Availability mockProviderProfileAvailability = Availability(
  id: AvailabilityId.fromString('provider-profile-availability-diana'),
  providerId: ProviderId.fromString('provider-profile-provider-diana'),
  status: AvailabilityStatus.active,
  type: AvailabilityType.fullTime,
  availableFrom: DateTime(2026, 1, 1, 8),
  availableTo: DateTime(2026, 1, 1, 18),
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final List<Service> mockProviderProfileServices = [
  Service(
    id: ServiceId.fromString('provider-profile-service-leak-repair'),
    providerId: ProviderId.fromString('provider-profile-provider-diana'),
    categoryId: CategoryId.fromString('provider-profile-category-plumbing'),
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
    id: ServiceId.fromString('provider-profile-service-pipe-install'),
    providerId: ProviderId.fromString('provider-profile-provider-diana'),
    categoryId: CategoryId.fromString('provider-profile-category-plumbing'),
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
    id: ServiceId.fromString('provider-profile-service-faucet-install'),
    providerId: ProviderId.fromString('provider-profile-provider-diana'),
    categoryId: CategoryId.fromString(
      'provider-profile-category-installations',
    ),
    name: 'Instalación de grifería',
    description: 'Instalación de grifos y llaves de paso.',
    basePrice: 30,
    estimatedDuration: 45,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

final List<Review> mockProviderProfileReviews = [
  Review(
    id: ReviewId.fromString('provider-profile-review-1'),
    orderId: OrderId.fromString('provider-profile-order-1'),
    providerId: ProviderId.fromString('provider-profile-provider-diana'),
    reviewerIdentityId: IdentityId.fromString('provider-profile-reviewer-1'),
    rating: const ReviewRating.of(5),
    title: 'Excelente trabajo',
    comment: 'Llegó puntual y solucionó la fuga en menos de una hora.',
    status: ReviewStatus.published,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Review(
    id: ReviewId.fromString('provider-profile-review-2'),
    orderId: OrderId.fromString('provider-profile-order-2'),
    providerId: ProviderId.fromString('provider-profile-provider-diana'),
    reviewerIdentityId: IdentityId.fromString('provider-profile-reviewer-2'),
    rating: const ReviewRating.of(4),
    title: 'Muy buen servicio',
    comment: 'Explicó todo el proceso y dejó el área limpia.',
    status: ReviewStatus.published,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Review(
    id: ReviewId.fromString('provider-profile-review-3'),
    orderId: OrderId.fromString('provider-profile-order-3'),
    providerId: ProviderId.fromString('provider-profile-provider-diana'),
    reviewerIdentityId: IdentityId.fromString('provider-profile-reviewer-3'),
    rating: const ReviewRating.of(5),
    title: 'Recomendada',
    comment: 'Precio justo y trabajo de calidad.',
    status: ReviewStatus.published,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Review(
    id: ReviewId.fromString('provider-profile-review-4'),
    orderId: OrderId.fromString('provider-profile-order-4'),
    providerId: ProviderId.fromString('provider-profile-provider-diana'),
    reviewerIdentityId: IdentityId.fromString('provider-profile-reviewer-4'),
    rating: const ReviewRating.of(4),
    title: 'Buena atención',
    comment: 'Respondió rápido y cumplió con el horario acordado.',
    status: ReviewStatus.published,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

/// Simulated stats/content not modeled by any domain entity — see
/// `ProviderProfileData` and the feature README for why each exists.
const int mockProviderProfileCompletedServices = 47;

const String mockProviderProfileResponseTime = 'Responde en menos de 1 hora';

/// Only the first label is currently rendered as the profile's cover
/// banner (`ProviderCover`) — the rest is reserved for a future
/// cover carousel. See the feature README.
const List<String> mockProviderProfileCoverImages = [
  'Portada del perfil',
  'Trabajo reciente',
];

const String mockProviderProfileAbout =
    'Plomera independiente con más de 8 años de experiencia atendiendo '
    'hogares y oficinas. Especializada en diagnóstico y reparación de '
    'fugas, instalación de tuberías nuevas y mantenimiento preventivo. '
    'Trabaja con materiales estándar y siempre deja el área de trabajo '
    'limpia al finalizar cada servicio.';

const List<String> mockProviderProfileSpecialties = [
  'Reparación de fugas',
  'Instalación de tuberías',
  'Mantenimiento preventivo',
  'Grifería',
];
