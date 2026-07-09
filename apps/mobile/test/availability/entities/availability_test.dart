import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/availability/entities/availability.dart';
import 'package:mobile/availability/models/availability_id.dart';
import 'package:mobile/availability/models/availability_status.dart';
import 'package:mobile/availability/models/availability_type.dart';
import 'package:mobile/provider/models/provider_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = AvailabilityId.create();
    final providerId = ProviderId.create();
    final now = DateTime(2026, 1, 1);
    final availability = Availability(
      id: id,
      providerId: providerId,
      status: AvailabilityStatus.active,
      type: AvailabilityType.fullTime,
      availableFrom: DateTime(2026, 1, 1),
      availableTo: DateTime(2026, 12, 31),
      createdAt: now,
      updatedAt: now,
    );

    expect(availability.id, id);
    expect(availability.providerId, providerId);
    expect(availability.status, AvailabilityStatus.active);
    expect(availability.type, AvailabilityType.fullTime);
  });

  test('is equal to another availability with the same id', () {
    final id = AvailabilityId.create();
    final providerId = ProviderId.create();
    final now = DateTime(2026, 1, 1);
    Availability build() => Availability(
      id: id,
      providerId: providerId,
      status: AvailabilityStatus.active,
      type: AvailabilityType.partTime,
      availableFrom: now,
      availableTo: now,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
