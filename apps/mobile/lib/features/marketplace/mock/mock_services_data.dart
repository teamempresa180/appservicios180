import '../../../category/models/category_id.dart';
import '../../../provider/models/provider_id.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock [Service] entities. `providerId`/
/// `categoryId` reference the ids used in `mock_providers_data.dart` and
/// `mock_categories_data.dart` — the presentation layer resolves those
/// into display names at render time (see `ServiceDisplay` in
/// `../models/`).
final List<Service> mockServices = [
  Service(
    id: ServiceId.fromString('service-leak-repair'),
    providerId: ProviderId.fromString('provider-ana'),
    categoryId: CategoryId.fromString('category-plumbing'),
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
    id: ServiceId.fromString('service-lighting-install'),
    providerId: ProviderId.fromString('provider-carlos'),
    categoryId: CategoryId.fromString('category-electricity'),
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
    id: ServiceId.fromString('service-deep-cleaning'),
    providerId: ProviderId.fromString('provider-lucia'),
    categoryId: CategoryId.fromString('category-cleaning'),
    name: 'Limpieza profunda de hogar',
    description: 'Limpieza completa de todas las áreas del hogar.',
    basePrice: 60,
    estimatedDuration: 120,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Service(
    id: ServiceId.fromString('service-garden-maintenance'),
    providerId: ProviderId.fromString('provider-jorge'),
    categoryId: CategoryId.fromString('category-gardening'),
    name: 'Mantenimiento de jardín',
    description: 'Poda, riego y limpieza de áreas verdes.',
    basePrice: 30,
    estimatedDuration: 90,
    status: ServiceStatus.active,
    type: ServiceType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

/// Simulated ratings, keyed by service id value. Not part of the
/// `Service` domain entity — see the feature README.
final Map<String, double> mockServiceRatings = {
  'service-leak-repair': 4.7,
  'service-lighting-install': 4.9,
  'service-deep-cleaning': 4.5,
  'service-garden-maintenance': 4.4,
};
