import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/address/entities/address.dart';
import 'package:mobile/contact/entities/contact.dart';
import 'package:mobile/features/profile/repositories/mock_profile_repository.dart';
import 'package:mobile/identity/entities/identity.dart';
import 'package:mobile/profiles/entities/profile.dart';

void main() {
  group('MockProfileRepository', () {
    final repository = MockProfileRepository();

    test('getProfile returns a real Profile with a display name', () {
      final profile = repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getIdentity returns a real Identity entity, not a map', () {
      expect(repository.getIdentity(), isA<Identity>());
    });

    test('getContacts returns real Contact entities, not maps', () {
      final contacts = repository.getContacts();
      expect(contacts, isNotEmpty);
      expect(contacts, everyElement(isA<Contact>()));
    });

    test('getAddress returns a real Address entity, not a map', () {
      expect(repository.getAddress(), isA<Address>());
    });

    test('profile and contacts reference the same identity', () {
      final identityId = repository.getIdentity().id;
      expect(repository.getProfile().identityId, equals(identityId));
      expect(
        repository.getContacts().every((c) => c.identityId == identityId),
        isTrue,
      );
      expect(repository.getAddress().identityId, equals(identityId));
    });

    test('is independent from every other feature mock data', () {
      expect(repository.getIdentity().id.value.startsWith('profile-'), isTrue);
    });
  });
}
