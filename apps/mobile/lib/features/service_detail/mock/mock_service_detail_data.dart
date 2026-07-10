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

/// Fixed, deterministic mock domain entities for the Service Detail
/// feature. Intentionally its own set — independent of
/// `features/marketplace/mock/` and `features/search/mock/` (see the
/// feature README). This feature shows a single, fixed service — there
/// is no id-based lookup yet.
final Category mockServiceDetailCategory = Category(
  id: CategoryId.fromString('service-detail-category-plumbing'),
  name: 'Plomería',
  description: 'Reparación e instalación de tuberías y grifería.',
  icon: 'plumbing',
  color: '#000000',
  status: CategoryStatus.active,
  type: CategoryType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Provider mockServiceDetailProvider = Provider(
  id: ProviderId.fromString('service-detail-provider-diana'),
  identityId: IdentityId.fromString('service-detail-identity-diana'),
  providerProfileId: ProfileId.fromString('service-detail-profile-diana'),
  status: ProviderStatus.active,
  type: ProviderType.independent,
  experience: ProviderExperience.advanced,
  biography:
      'Plomera independiente, 8 años de experiencia en '
      'reparaciones residenciales.',
  yearsOfExperience: 8,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Profile mockServiceDetailProfile = Profile(
  id: ProfileId.fromString('service-detail-profile-diana'),
  identityId: IdentityId.fromString('service-detail-identity-diana'),
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio: mockServiceDetailProvider.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Service mockServiceDetailService = Service(
  id: ServiceId.fromString('service-detail-service-leak-repair'),
  providerId: ProviderId.fromString('service-detail-provider-diana'),
  categoryId: CategoryId.fromString('service-detail-category-plumbing'),
  name: 'Reparación de fuga de agua',
  description: 'Diagnóstico y reparación de fugas en tuberías.',
  basePrice: 45,
  estimatedDuration: 60,
  status: ServiceStatus.active,
  type: ServiceType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final List<Review> mockServiceDetailReviews = [
  Review(
    id: ReviewId.fromString('service-detail-review-1'),
    orderId: OrderId.fromString('service-detail-order-1'),
    providerId: ProviderId.fromString('service-detail-provider-diana'),
    reviewerIdentityId: IdentityId.fromString('service-detail-reviewer-1'),
    rating: const ReviewRating.of(5),
    title: 'Excelente trabajo',
    comment: 'Llegó puntual y solucionó la fuga en menos de una hora.',
    status: ReviewStatus.published,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Review(
    id: ReviewId.fromString('service-detail-review-2'),
    orderId: OrderId.fromString('service-detail-order-2'),
    providerId: ProviderId.fromString('service-detail-provider-diana'),
    reviewerIdentityId: IdentityId.fromString('service-detail-reviewer-2'),
    rating: const ReviewRating.of(4),
    title: 'Muy buen servicio',
    comment: 'Explicó todo el proceso y dejó el área limpia.',
    status: ReviewStatus.published,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Review(
    id: ReviewId.fromString('service-detail-review-3'),
    orderId: OrderId.fromString('service-detail-order-3'),
    providerId: ProviderId.fromString('service-detail-provider-diana'),
    reviewerIdentityId: IdentityId.fromString('service-detail-reviewer-3'),
    rating: const ReviewRating.of(5),
    title: 'Recomendado',
    comment: 'Precio justo y trabajo de calidad.',
    status: ReviewStatus.published,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

/// Simulated image gallery labels — no real images/illustrations exist
/// yet (no official branding), so the gallery renders neutral
/// placeholders using these labels + a Material Icon. See the feature
/// README.
const List<String> mockServiceDetailImages = [
  'Imagen principal',
  'Antes de la reparación',
  'Durante el trabajo',
  'Resultado final',
];

/// A longer description than `Service.description` provides — the
/// domain entity's field is a short one-liner; a detail screen needs
/// more context. Simulated, not part of the domain. See the feature
/// README.
const String mockServiceDetailLongDescription =
    'Servicio profesional de reparación de fugas de agua para hogares y '
    'oficinas. Incluye diagnóstico completo del sistema de tuberías, '
    'identificación del punto de fuga, reparación o reemplazo de la '
    'sección afectada y prueba de presión final para confirmar que el '
    'problema quedó resuelto. Se utilizan materiales estándar y se deja '
    'el área de trabajo limpia al finalizar.';
