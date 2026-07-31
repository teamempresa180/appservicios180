import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../models/address_id.dart';
import '../models/address_type.dart';
import '../models/address_status.dart';

/// Represents a physical address associated with an Identity.
/// Pure data holder — no maps rendering, no validation, no behavior.
/// [latitude]/[longitude] are an optional geolocation pin dropped by
/// the client on `AddressMapPicker` (both present or both `null`) —
/// on top of the required text fields.
class Address extends Entity<AddressId> {
  const Address({
    required AddressId id,
    required this.identityId,
    required this.alias,
    required this.fullAddress,
    required this.city,
    required this.state,
    required this.country,
    required this.postalCode,
    required this.type,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    this.latitude,
    this.longitude,
  }) : super(id);

  final IdentityId identityId;
  final String alias;
  final String fullAddress;
  final String city;
  final String state;
  final String country;
  final String postalCode;
  final double? latitude;
  final double? longitude;
  final AddressType type;
  final AddressStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;

  /// [clearLocation] explicitly clears the map pin (sets both
  /// [latitude]/[longitude] to `null`) — plain `latitude`/`longitude`
  /// arguments update the pin, and omitting all three keeps it as-is.
  Address copyWith({
    String? alias,
    String? fullAddress,
    double? latitude,
    double? longitude,
    bool clearLocation = false,
  }) {
    return Address(
      id: id,
      identityId: identityId,
      alias: alias ?? this.alias,
      fullAddress: fullAddress ?? this.fullAddress,
      city: city,
      state: state,
      country: country,
      postalCode: postalCode,
      latitude: clearLocation ? null : (latitude ?? this.latitude),
      longitude: clearLocation ? null : (longitude ?? this.longitude),
      type: type,
      status: status,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
