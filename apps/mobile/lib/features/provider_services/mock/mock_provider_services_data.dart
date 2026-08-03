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

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock domain entities for the Provider Services
/// feature. Intentionally its own set — independent of every other
/// feature's mock data (see the feature README). Four services with
/// varying `ServiceStatus` (2 active, 1 inactive/"paused", 1 archived)
/// sharing a single `Provider`/`Profile` — there is no id-based lookup
/// yet.
final Provider mockServicesProvider = Provider(
  id: ProviderId.fromString('provider-services-provider-diana'),
  identityId: IdentityId.fromString('provider-services-identity-diana'),
  providerProfileId: ProfileId.fromString('provider-services-profile-diana'),
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

final Profile mockServicesProfile = Profile(
  id: ProfileId.fromString('provider-services-profile-diana'),
  identityId: mockServicesProvider.identityId,
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio: mockServicesProvider.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Category _categoryPlumbing = Category(
  id: CategoryId.fromString('provider-services-category-plumbing'),
  name: 'Plomería',
  description: 'Reparación e instalación de tuberías y grifería.',
  icon: 'plumbing',
  color: '#000000',
  status: CategoryStatus.active,
  type: CategoryType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Category _categoryElectrical = Category(
  id: CategoryId.fromString('provider-services-category-electrical'),
  name: 'Electricidad',
  description: 'Instalación y reparación de sistemas eléctricos.',
  icon: 'electrical_services',
  color: '#000000',
  status: CategoryStatus.active,
  type: CategoryType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Service _serviceLeakRepair = Service(
  id: ServiceId.fromString('provider-services-service-leak-repair'),
  providerId: mockServicesProvider.id,
  categoryId: _categoryPlumbing.id,
  name: 'Reparación de fuga de agua',
  description: 'Diagnóstico y reparación de fugas en tuberías.',
  basePrice: 45,
  estimatedDuration: 60,
  status: ServiceStatus.active,
  type: ServiceType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Service _servicePipeInstall = Service(
  id: ServiceId.fromString('provider-services-service-pipe-install'),
  providerId: mockServicesProvider.id,
  categoryId: _categoryPlumbing.id,
  name: 'Instalación de tuberías',
  description: 'Instalación completa de tuberías nuevas.',
  basePrice: 80,
  estimatedDuration: 180,
  status: ServiceStatus.active,
  type: ServiceType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Service _serviceOutletInstall = Service(
  id: ServiceId.fromString('provider-services-service-outlet-install'),
  providerId: mockServicesProvider.id,
  categoryId: _categoryElectrical.id,
  name: 'Instalación de tomacorrientes',
  description: 'Instalación de tomacorrientes nuevos.',
  basePrice: 35,
  estimatedDuration: 90,
  status: ServiceStatus.inactive,
  type: ServiceType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Service _serviceFaucetInstall = Service(
  id: ServiceId.fromString('provider-services-service-faucet-install'),
  providerId: mockServicesProvider.id,
  categoryId: _categoryPlumbing.id,
  name: 'Instalación de grifería',
  description: 'Instalación de grifos y llaves de paso.',
  basePrice: 30,
  estimatedDuration: 45,
  status: ServiceStatus.archived,
  type: ServiceType.standard,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final List<Service> mockProviderServices = [
  _serviceLeakRepair,
  _servicePipeInstall,
  _serviceOutletInstall,
  _serviceFaucetInstall,
];

final Map<ServiceId, Category> mockServiceCategories = {
  _serviceLeakRepair.id: _categoryPlumbing,
  _servicePipeInstall.id: _categoryPlumbing,
  _serviceOutletInstall.id: _categoryElectrical,
  _serviceFaucetInstall.id: _categoryPlumbing,
};
