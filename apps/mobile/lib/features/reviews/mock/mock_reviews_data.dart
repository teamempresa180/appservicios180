import '../../../category/models/category_id.dart';
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
import '../../../review/entities/review.dart';
import '../../../review/models/review_id.dart';
import '../../../review/models/review_rating.dart';
import '../../../review/models/review_status.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock domain entities for the Reviews feature.
/// Intentionally its own set — independent of every other feature's
/// mock data (see the feature README). Four reviews with varying
/// ratings, sharing a single provider ("Diana") for simplicity — there
/// is no id-based lookup yet.
final Provider mockReviewsProvider = Provider(
  id: ProviderId.fromString('reviews-provider-diana'),
  identityId: IdentityId.fromString('reviews-identity-diana'),
  providerProfileId: ProfileId.fromString('reviews-profile-diana'),
  status: ProviderStatus.active,
  type: ProviderType.independent,
  experience: ProviderExperience.advanced,
  biography: 'Plomera independiente, especializada en reparaciones '
      'residenciales.',
  yearsOfExperience: 8,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Profile mockReviewsProfile = Profile(
  id: ProfileId.fromString('reviews-profile-diana'),
  identityId: mockReviewsProvider.identityId,
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio: mockReviewsProvider.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final ReviewId _review1Id = ReviewId.fromString('reviews-review-1');
final ReviewId _review2Id = ReviewId.fromString('reviews-review-2');
final ReviewId _review3Id = ReviewId.fromString('reviews-review-3');
final ReviewId _review4Id = ReviewId.fromString('reviews-review-4');

final Review _review1 = Review(
  id: _review1Id,
  orderId: OrderId.fromString('reviews-order-1'),
  providerId: mockReviewsProvider.id,
  reviewerIdentityId: IdentityId.fromString('reviews-identity-client-1'),
  rating: const ReviewRating.of(5),
  title: 'Excelente trabajo',
  comment: 'Llegó puntual y solucionó la fuga en menos de una hora.',
  status: ReviewStatus.published,
  createdAt: DateTime(2026, 1, 10),
  updatedAt: DateTime(2026, 1, 10),
);

final Review _review2 = Review(
  id: _review2Id,
  orderId: OrderId.fromString('reviews-order-2'),
  providerId: mockReviewsProvider.id,
  reviewerIdentityId: IdentityId.fromString('reviews-identity-client-1'),
  rating: const ReviewRating.of(4),
  title: 'Muy buen servicio',
  comment: 'Explicó todo el proceso y dejó el área limpia.',
  status: ReviewStatus.published,
  createdAt: DateTime(2026, 1, 8),
  updatedAt: DateTime(2026, 1, 8),
);

final Review _review3 = Review(
  id: _review3Id,
  orderId: OrderId.fromString('reviews-order-3'),
  providerId: mockReviewsProvider.id,
  reviewerIdentityId: IdentityId.fromString('reviews-identity-client-2'),
  rating: const ReviewRating.of(3),
  title: 'Servicio aceptable',
  comment: 'Cumplió, pero llegó una hora después de lo acordado.',
  status: ReviewStatus.published,
  createdAt: DateTime(2026, 1, 5),
  updatedAt: DateTime(2026, 1, 5),
);

final Review _review4 = Review(
  id: _review4Id,
  orderId: OrderId.fromString('reviews-order-4'),
  providerId: mockReviewsProvider.id,
  reviewerIdentityId: IdentityId.fromString('reviews-identity-client-1'),
  rating: const ReviewRating.of(1),
  title: 'No quedé satisfecho',
  comment: 'La fuga volvió a aparecer a los dos días.',
  status: ReviewStatus.pending,
  createdAt: DateTime(2026, 1, 2),
  updatedAt: DateTime(2026, 1, 2),
);

final List<Review> mockReviews = [_review1, _review2, _review3, _review4];

final Map<ReviewId, Provider> mockReviewProviders = {
  for (final review in mockReviews) review.id: mockReviewsProvider,
};

final Map<ReviewId, Profile> mockReviewProfiles = {
  for (final review in mockReviews) review.id: mockReviewsProfile,
};

final Map<ReviewId, Order> mockReviewOrders = {
  _review1Id: Order(
    id: OrderId.fromString('reviews-order-1'),
    identityId: IdentityId.fromString('reviews-identity-client-1'),
    providerId: mockReviewsProvider.id,
    serviceId: ServiceId.fromString('reviews-service-leak-repair'),
    title: 'Reparación de fuga de agua',
    description: 'Fuga debajo del lavaplatos de la cocina.',
    scheduledDate: DateTime(2026, 1, 9, 10, 0),
    status: OrderStatus.completed,
    priority: OrderPriority.medium,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _review2Id: Order(
    id: OrderId.fromString('reviews-order-2'),
    identityId: IdentityId.fromString('reviews-identity-client-1'),
    providerId: mockReviewsProvider.id,
    serviceId: ServiceId.fromString('reviews-service-pipe-install'),
    title: 'Instalación de tuberías',
    description: 'Instalación completa de tuberías nuevas.',
    scheduledDate: DateTime(2026, 1, 7, 9, 0),
    status: OrderStatus.completed,
    priority: OrderPriority.medium,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _review3Id: Order(
    id: OrderId.fromString('reviews-order-3'),
    identityId: IdentityId.fromString('reviews-identity-client-2'),
    providerId: mockReviewsProvider.id,
    serviceId: ServiceId.fromString('reviews-service-faucet-install'),
    title: 'Instalación de grifería',
    description: 'Instalación de grifos nuevos en la cocina.',
    scheduledDate: DateTime(2026, 1, 4, 16, 0),
    status: OrderStatus.completed,
    priority: OrderPriority.low,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _review4Id: Order(
    id: OrderId.fromString('reviews-order-4'),
    identityId: IdentityId.fromString('reviews-identity-client-1'),
    providerId: mockReviewsProvider.id,
    serviceId: ServiceId.fromString('reviews-service-outlet-install'),
    title: 'Instalación de tomacorrientes',
    description: 'Instalación de tomacorrientes nuevos en la sala.',
    scheduledDate: DateTime(2026, 1, 1, 14, 30),
    status: OrderStatus.completed,
    priority: OrderPriority.high,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
};

final Map<ReviewId, Service> mockReviewServices = {
  _review1Id: Service(
    id: ServiceId.fromString('reviews-service-leak-repair'),
    providerId: mockReviewsProvider.id,
    categoryId: CategoryId.fromString('reviews-category-plumbing'),
    name: 'Reparación de fuga de agua',
    description: 'Diagnóstico y reparación de fugas en tuberías.',
    basePrice: 45,
    estimatedDuration: 60,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _review2Id: Service(
    id: ServiceId.fromString('reviews-service-pipe-install'),
    providerId: mockReviewsProvider.id,
    categoryId: CategoryId.fromString('reviews-category-plumbing'),
    name: 'Instalación de tuberías',
    description: 'Instalación completa de tuberías nuevas.',
    basePrice: 80,
    estimatedDuration: 180,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _review3Id: Service(
    id: ServiceId.fromString('reviews-service-faucet-install'),
    providerId: mockReviewsProvider.id,
    categoryId: CategoryId.fromString('reviews-category-plumbing'),
    name: 'Instalación de grifería',
    description: 'Instalación de grifos y llaves de paso.',
    basePrice: 30,
    estimatedDuration: 45,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  _review4Id: Service(
    id: ServiceId.fromString('reviews-service-outlet-install'),
    providerId: mockReviewsProvider.id,
    categoryId: CategoryId.fromString('reviews-category-electrical'),
    name: 'Instalación de tomacorrientes',
    description: 'Instalación de tomacorrientes nuevos.',
    basePrice: 35,
    estimatedDuration: 90,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
};

/// Simulated content not modeled by any domain entity — see
/// `ReviewDisplay` and the feature README for why each exists.
final Map<ReviewId, String> mockReviewerNames = {
  _review1Id: 'Cliente verificado',
  _review2Id: 'Cliente verificado',
  _review3Id: 'Cliente verificado',
  _review4Id: 'Cliente verificado',
};

/// Only the first review is simulated as "mine" (editable) — the rest
/// are other clients' reviews about the same provider.
final Map<ReviewId, bool> mockReviewIsOwn = {
  _review1Id: true,
  _review2Id: true,
  _review3Id: false,
  _review4Id: true,
};

final Map<ReviewId, bool> mockReviewCanEdit = {
  _review1Id: true,
  _review2Id: true,
  _review3Id: false,
  _review4Id: false,
};
