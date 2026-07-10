import '../../../availability/entities/availability.dart';
import '../../../availability/models/availability_id.dart';
import '../../../availability/models/availability_status.dart';
import '../../../availability/models/availability_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_experience.dart';
import '../../../provider/models/provider_id.dart';
import '../../../provider/models/provider_status.dart';
import '../../../provider/models/provider_type.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// A known Monday (2024-01-01) used only as a base date so that each
/// mock `Availability.availableFrom.weekday` correctly encodes which
/// day of the week it represents — see `AvailabilityDisplay`'s class
/// doc and the feature README for why the day itself is derived from
/// this real field instead of a separate simulated label.
final DateTime _monday = DateTime(2024, 1, 1);

final Provider mockAvailabilityProvider = Provider(
  id: ProviderId.fromString('availability-provider-diana'),
  identityId: IdentityId.fromString('availability-identity-diana'),
  providerProfileId: ProfileId.fromString('availability-profile-diana'),
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

DateTime _at(int dayOffset, int hour, int minute) {
  final day = _monday.add(Duration(days: dayOffset));
  return DateTime(day.year, day.month, day.day, hour, minute);
}

/// Fixed, deterministic mock domain entities for the Availability
/// feature. Intentionally its own set — independent of every other
/// feature's mock data (see the feature README). One real
/// `Availability` per day of the week (Monday–Sunday): active with
/// working hours Monday–Friday, active with shorter hours Saturday,
/// inactive Sunday.
final List<Availability> mockAvailabilities = [
  Availability(
    id: AvailabilityId.fromString('availability-monday'),
    providerId: mockAvailabilityProvider.id,
    status: AvailabilityStatus.active,
    type: AvailabilityType.fullTime,
    availableFrom: _at(0, 8, 0),
    availableTo: _at(0, 18, 0),
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Availability(
    id: AvailabilityId.fromString('availability-tuesday'),
    providerId: mockAvailabilityProvider.id,
    status: AvailabilityStatus.active,
    type: AvailabilityType.fullTime,
    availableFrom: _at(1, 8, 0),
    availableTo: _at(1, 18, 0),
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Availability(
    id: AvailabilityId.fromString('availability-wednesday'),
    providerId: mockAvailabilityProvider.id,
    status: AvailabilityStatus.active,
    type: AvailabilityType.fullTime,
    availableFrom: _at(2, 8, 0),
    availableTo: _at(2, 18, 0),
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Availability(
    id: AvailabilityId.fromString('availability-thursday'),
    providerId: mockAvailabilityProvider.id,
    status: AvailabilityStatus.active,
    type: AvailabilityType.fullTime,
    availableFrom: _at(3, 8, 0),
    availableTo: _at(3, 18, 0),
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Availability(
    id: AvailabilityId.fromString('availability-friday'),
    providerId: mockAvailabilityProvider.id,
    status: AvailabilityStatus.active,
    type: AvailabilityType.fullTime,
    availableFrom: _at(4, 8, 0),
    availableTo: _at(4, 18, 0),
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Availability(
    id: AvailabilityId.fromString('availability-saturday'),
    providerId: mockAvailabilityProvider.id,
    status: AvailabilityStatus.active,
    type: AvailabilityType.partTime,
    availableFrom: _at(5, 9, 0),
    availableTo: _at(5, 14, 0),
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Availability(
    id: AvailabilityId.fromString('availability-sunday'),
    providerId: mockAvailabilityProvider.id,
    status: AvailabilityStatus.inactive,
    type: AvailabilityType.fullTime,
    availableFrom: _at(6, 0, 0),
    availableTo: _at(6, 0, 0),
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

/// Simulated content not modeled by any domain entity — see
/// `AvailabilityDisplay` and the feature README for why each exists.
const String mockAvailabilityNextAvailableLabel =
    'Disponible mañana a las 8:00 a.m.';

const String mockAvailabilityWorkingHoursLabel =
    'Lunes a viernes 8:00 a.m. – 6:00 p.m., sábados 9:00 a.m. – 2:00 p.m.';
