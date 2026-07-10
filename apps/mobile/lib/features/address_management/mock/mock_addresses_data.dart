import '../../../address/entities/address.dart';
import '../../../address/models/address_id.dart';
import '../../../address/models/address_status.dart';
import '../../../address/models/address_type.dart';
import '../../../contact/entities/contact.dart';
import '../../../contact/models/contact_id.dart';
import '../../../contact/models/contact_status.dart';
import '../../../contact/models/contact_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../profiles/entities/profile.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../profiles/models/profile_status.dart';
import '../../../profiles/models/profile_visibility.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

final IdentityId _identityId = IdentityId.fromString(
  'address-management-identity-client',
);

/// Fixed, deterministic mock domain entities for the Address
/// Management feature. Intentionally its own set — independent of
/// every other feature's mock data (see the feature README). Three
/// addresses ("Casa"/"Trabajo"/"Oficina") sharing a single
/// `Profile`/`Contact` for simplicity — there is no id-based
/// per-address lookup beyond what the list already provides.
final Profile mockAddressesProfile = Profile(
  id: ProfileId.fromString('address-management-profile-client'),
  identityId: _identityId,
  displayName: 'Camila Torres',
  avatarUrl: null,
  bio: 'Cliente frecuente de servicios del hogar.',
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Contact mockAddressesContact = Contact(
  id: ContactId.fromString('address-management-contact-phone'),
  identityId: _identityId,
  type: ContactType.phone,
  value: '+57 300 123 4567',
  status: ContactStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Address mockAddressHome = Address(
  id: AddressId.fromString('address-management-address-home'),
  identityId: _identityId,
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

final Address mockAddressWork = Address(
  id: AddressId.fromString('address-management-address-work'),
  identityId: _identityId,
  alias: 'Trabajo',
  fullAddress: 'Carrera 7 # 71-21, Piso 8',
  city: 'Bogotá',
  state: 'Cundinamarca',
  country: 'Colombia',
  postalCode: '110231',
  type: AddressType.work,
  status: AddressStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Address mockAddressOffice = Address(
  id: AddressId.fromString('address-management-address-office'),
  identityId: _identityId,
  alias: 'Oficina',
  fullAddress: 'Avenida 19 # 104-62, Local 3',
  city: 'Bogotá',
  state: 'Cundinamarca',
  country: 'Colombia',
  postalCode: '110111',
  type: AddressType.other,
  status: AddressStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final List<Address> mockAddresses = [
  mockAddressHome,
  mockAddressWork,
  mockAddressOffice,
];

/// Simulated content not modeled by any domain entity — see
/// `AddressDisplay` and the feature README for why each exists. Only
/// "Casa" is simulated as the default address.
final Map<AddressId, bool> mockAddressIsDefault = {
  mockAddressHome.id: true,
  mockAddressWork.id: false,
  mockAddressOffice.id: false,
};

final Map<AddressId, String> mockAddressDeliveryInstructions = {
  mockAddressHome.id: 'Timbre azul, segundo piso.',
  mockAddressWork.id: 'Preguntar en recepción por Camila Torres.',
  mockAddressOffice.id: 'Entregar en portería, local 3.',
};
