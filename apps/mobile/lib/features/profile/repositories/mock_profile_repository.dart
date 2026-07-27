import 'dart:convert';
import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../contact/models/contact_id.dart';
import '../../../contact/models/contact_status.dart';
import '../../../contact/models/contact_type.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';
import '../mock/mock_profile_data.dart';
import 'profile_repository.dart';

/// In-memory `ProfileRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README. Keeps
/// its own mutable `_contacts`/`_address` (same pattern as `_profile`
/// below) so `updatePhone`/`updateEmail`/`updateAddress` actually
/// change what `getContacts`/`getAddress` return afterwards.
class MockProfileRepository implements ProfileRepository {
  Profile _profile = mockProfile;
  final List<Contact> _contacts = List.of(mockContacts);
  Address _address = mockProfileAddress;

  @override
  Future<Profile> getProfile() => Future.value(_profile);

  @override
  Future<Identity> getIdentity() => Future.value(mockIdentity);

  @override
  Future<List<Contact>> getContacts() =>
      Future.value(List.unmodifiable(_contacts));

  @override
  Future<Address> getAddress() => Future.value(_address);

  @override
  Future<Profile> updateDisplayName(String displayName) async {
    _profile = _profile.copyWith(displayName: displayName);
    return _profile;
  }

  Future<Contact> _updateContact(ContactType type, String value) async {
    final index = _contacts.indexWhere((contact) => contact.type == type);
    if (index != -1) {
      final updated = _contacts[index].copyWith(value: value);
      _contacts[index] = updated;
      return updated;
    }
    final created = Contact(
      id: ContactId.create(),
      identityId: mockIdentity.id,
      type: type,
      value: value,
      status: ContactStatus.active,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    _contacts.add(created);
    return created;
  }

  @override
  Future<Contact> updatePhone(String value) =>
      _updateContact(ContactType.phone, value);

  @override
  Future<Contact> updateEmail(String value) =>
      _updateContact(ContactType.email, value);

  @override
  Future<Address> updateAddress({
    required String alias,
    required String fullAddress,
  }) async {
    _address = _address.copyWith(alias: alias, fullAddress: fullAddress);
    return _address;
  }

  /// No real upload/storage here — encodes the picked bytes as a
  /// `data:` URI so `AppAvatar` can still render the real photo the
  /// user just picked, even without a backend (see `AppAvatar`'s
  /// `data:`-URI handling).
  @override
  Future<Profile> updateAvatar({
    required List<int> fileBytes,
    required String fileName,
    void Function(double progress)? onProgress,
  }) async {
    onProgress?.call(1);
    final mimeType = fileName.toLowerCase().endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';
    _profile = _profile.copyWith(
      avatarUrl: 'data:$mimeType;base64,${base64Encode(fileBytes)}',
    );
    return _profile;
  }
}
