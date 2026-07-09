import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../models/address_id.dart';
import '../models/address_type.dart';
import '../models/address_status.dart';

/// Represents a physical address associated with an Identity.
/// Pure data holder — no geolocation, no maps, no validation, no behavior.
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
  }) : super(id);

  final IdentityId identityId;
  final String alias;
  final String fullAddress;
  final String city;
  final String state;
  final String country;
  final String postalCode;
  final AddressType type;
  final AddressStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
}
