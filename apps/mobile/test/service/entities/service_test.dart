import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/service/entities/service.dart';
import 'package:mobile/service/models/service_id.dart';
import 'package:mobile/service/models/service_status.dart';
import 'package:mobile/service/models/service_type.dart';
import 'package:mobile/provider/models/provider_id.dart';
import 'package:mobile/category/models/category_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = ServiceId.create();
    final providerId = ProviderId.create();
    final categoryId = CategoryId.create();
    final now = DateTime(2026, 1, 1);
    final service = Service(
      id: id,
      providerId: providerId,
      categoryId: categoryId,
      name: 'Destape de tubería',
      description: 'Destape de tuberías residenciales',
      basePrice: 50000,
      estimatedDuration: 60,
      status: ServiceStatus.active,
      type: ServiceType.standard,
      createdAt: now,
      updatedAt: now,
    );

    expect(service.id, id);
    expect(service.providerId, providerId);
    expect(service.categoryId, categoryId);
    expect(service.name, 'Destape de tubería');
    expect(service.basePrice, 50000);
    expect(service.estimatedDuration, 60);
    expect(service.status, ServiceStatus.active);
    expect(service.type, ServiceType.standard);
  });

  test('is equal to another service with the same id', () {
    final id = ServiceId.create();
    final providerId = ProviderId.create();
    final categoryId = CategoryId.create();
    final now = DateTime(2026, 1, 1);
    Service build() => Service(
      id: id,
      providerId: providerId,
      categoryId: categoryId,
      name: 'Servicio',
      description: 'Desc',
      basePrice: 1000,
      estimatedDuration: 30,
      status: ServiceStatus.active,
      type: ServiceType.standard,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
