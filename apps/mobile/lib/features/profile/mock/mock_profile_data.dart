import '../../../address/entities/address.dart';
import '../../../address/models/address_id.dart';
import '../../../address/models/address_status.dart';
import '../../../address/models/address_type.dart';
import '../../../contact/entities/contact.dart';
import '../../../contact/models/contact_id.dart';
import '../../../contact/models/contact_status.dart';
import '../../../contact/models/contact_type.dart';
import '../../../identity/entities/identity.dart';
import '../../../identity/models/document_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../identity/models/identity_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../profiles/models/profile_status.dart';
import '../../../profiles/models/profile_visibility.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock domain entities for the Profile feature.
/// Intentionally its own set — independent of every other feature's
/// mock data (see the feature README). This feature shows a single,
/// fixed account — there is no id-based lookup yet.
final Identity mockIdentity = Identity(
  id: IdentityId.fromString('profile-identity-client'),
  fullName: 'Camila Torres',
  documentType: DocumentType.nationalId,
  documentNumber: '1094825671',
  birthDate: DateTime(1994, 6, 12),
  status: IdentityStatus.active,
  createdAt: DateTime(2025, 8, 1),
  updatedAt: _seedTimestamp,
);

final Profile mockProfile = Profile(
  id: ProfileId.fromString('profile-profile-client'),
  identityId: mockIdentity.id,
  displayName: 'Camila Torres',
  avatarUrl: null,
  bio: 'Cliente frecuente de servicios del hogar.',
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final List<Contact> mockContacts = [
  Contact(
    id: ContactId.fromString('profile-contact-email'),
    identityId: mockIdentity.id,
    type: ContactType.email,
    value: 'camila.torres@example.com',
    status: ContactStatus.active,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Contact(
    id: ContactId.fromString('profile-contact-phone'),
    identityId: mockIdentity.id,
    type: ContactType.phone,
    value: '+57 300 123 4567',
    status: ContactStatus.active,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];

final Address mockProfileAddress = Address(
  id: AddressId.fromString('profile-address-home'),
  identityId: mockIdentity.id,
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
/// `ProfileDisplay` and the feature README for why each exists.
const int mockProfileCompletionPercentage = 75;

const List<String> mockProfileCompletionItems = [
  'Agrega una foto de perfil',
  'Verifica tu número de teléfono',
];
