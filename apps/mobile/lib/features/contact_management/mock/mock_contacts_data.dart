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
  'contact-management-identity-camila',
);

/// Fixed, deterministic mock domain entities for the Contact Management
/// feature. Intentionally its own set — independent of every other
/// feature's mock data (see the feature README, including
/// `address_management`, which reuses a single fixed `Contact` as
/// supporting data but never gives `Contact` its own management
/// screen).
final Profile mockContactsProfile = Profile(
  id: ProfileId.fromString('contact-management-profile-camila'),
  identityId: _identityId,
  displayName: 'Camila Torres',
  avatarUrl: null,
  bio: 'Cliente frecuente de servicios del hogar.',
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// Five real `Contact` records covering every `ContactType`
/// (`email`/`phone`/`other`) and every `ContactStatus`
/// (`active`/`inactive`/`archived`) at least once.
final List<Contact> mockContacts = [
  Contact(
    id: ContactId.fromString('contact-management-email-primary'),
    identityId: _identityId,
    type: ContactType.email,
    value: 'camila.torres@example.com',
    status: ContactStatus.active,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Contact(
    id: ContactId.fromString('contact-management-phone-primary'),
    identityId: _identityId,
    type: ContactType.phone,
    value: '+57 310 456 7890',
    status: ContactStatus.active,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Contact(
    id: ContactId.fromString('contact-management-whatsapp'),
    identityId: _identityId,
    type: ContactType.other,
    value: 'WhatsApp: +57 310 456 7890',
    status: ContactStatus.active,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Contact(
    id: ContactId.fromString('contact-management-email-old'),
    identityId: _identityId,
    type: ContactType.email,
    value: 'camila.old@example.com',
    status: ContactStatus.inactive,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Contact(
    id: ContactId.fromString('contact-management-phone-old'),
    identityId: _identityId,
    type: ContactType.phone,
    value: '+57 300 111 2222',
    status: ContactStatus.archived,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];
