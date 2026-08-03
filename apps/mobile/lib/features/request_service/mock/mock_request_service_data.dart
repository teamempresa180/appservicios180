import '../../../address/entities/address.dart';
import '../../../address/models/address_id.dart';
import '../../../address/models/address_status.dart';
import '../../../address/models/address_type.dart';
import '../../../availability/entities/availability.dart';
import '../../../availability/models/availability_id.dart';
import '../../../availability/models/availability_status.dart';
import '../../../availability/models/availability_type.dart';
import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';
import '../../../category/models/category_status.dart';
import '../../../category/models/category_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../profiles/entities/profile.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../profiles/models/profile_status.dart';
import '../../../profiles/models/profile_visibility.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_experience.dart';
import '../../../provider/models/provider_id.dart';
import '../../../provider/models/provider_status.dart';
import '../../../provider/models/provider_type.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';
import '../models/request_priority.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock domain entities for the Request Service
/// feature. Intentionally its own set — independent of every other
/// feature's mock data (see the feature README). This feature shows a
/// single, fixed service/provider — there is no id-based lookup yet.
final Category mockRequestServiceCategory = Category(
  id: CategoryId.fromString('request-service-category-plumbing'),
  name: 'Plomería',
  description: 'Reparación e instalación de tuberías y grifería.',
  icon: 'plumbing',
  color: '#000000',
  status: CategoryStatus.active,
  type: CategoryType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Provider mockRequestServiceProvider = Provider(
  id: ProviderId.fromString('request-service-provider-diana'),
  identityId: IdentityId.fromString('request-service-identity-diana'),
  providerProfileId: ProfileId.fromString('request-service-profile-diana'),
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

final Profile mockRequestServiceProfile = Profile(
  id: ProfileId.fromString('request-service-profile-diana'),
  identityId: IdentityId.fromString('request-service-identity-diana'),
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio: mockRequestServiceProvider.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Service mockRequestServiceService = Service(
  id: ServiceId.fromString('request-service-service-leak-repair'),
  providerId: ProviderId.fromString('request-service-provider-diana'),
  categoryId: CategoryId.fromString('request-service-category-plumbing'),
  name: 'Reparación de fuga de agua',
  description: 'Diagnóstico y reparación de fugas en tuberías.',
  basePrice: 45,
  estimatedDuration: 60,
  status: ServiceStatus.active,
  type: ServiceType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Availability mockRequestServiceAvailability = Availability(
  id: AvailabilityId.fromString('request-service-availability-diana'),
  providerId: ProviderId.fromString('request-service-provider-diana'),
  status: AvailabilityStatus.active,
  type: AvailabilityType.fullTime,
  availableFrom: DateTime(2026, 1, 1, 8),
  availableTo: DateTime(2026, 1, 1, 18),
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Address mockRequestServiceAddress = Address(
  id: AddressId.fromString('request-service-address-client'),
  identityId: IdentityId.fromString('request-service-identity-client'),
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

/// Simulated content not modeled by any domain entity — see
/// `RequestServiceData` and the feature README for why each exists.
///
/// [defaultRequestServiceScheduledDate] used to be a fixed calendar date
/// (2026-01-10) baked into this file — since that's now in the past for
/// any real pilot run, a client who never touched the date picker would
/// silently submit an order scheduled *before* they even created it.
/// Computed fresh (relative to "now") instead, so the default the form
/// opens with is always tomorrow.
DateTime defaultRequestServiceScheduledDate() {
  final now = DateTime.now();
  return DateTime(now.year, now.month, now.day).add(const Duration(days: 1));
}

const String mockRequestServiceSelectedTime = '10:00';

/// Empty on purpose. This used to seed two fake photo tiles ("Foto de
/// la fuga", "Foto del mueble afectado") into every single request a
/// real client opened — they looked like photos the client had already
/// attached, so the form claimed evidence had been sent that the
/// provider would never receive. Until real photo upload exists, the
/// section shows only its "add" tile (which says "próximamente").
const List<String> mockRequestServiceAttachments = <String>[];

const RequestPriority mockRequestServicePriority = RequestPriority.normal;

const String mockRequestServiceLocationLabel = 'Ubicación actual (simulada)';
