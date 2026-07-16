import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/contact/entities/contact.dart';
import 'package:mobile/features/contact_management/repositories/mock_contact_management_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';

void main() {
  group('MockContactManagementRepository', () {
    final repository = MockContactManagementRepository();

    test('getProfile returns a real Profile with a display name', () async {
      final profile = await repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getContacts returns real Contact entities, not maps', () async {
      final contacts = await repository.getContacts();
      expect(contacts, isNotEmpty);
      expect(contacts, everyElement(isA<Contact>()));
    });

    test('returns five contacts covering every type and status', () async {
      final contacts = await repository.getContacts();
      expect(contacts.length, equals(5));
      expect(contacts.map((c) => c.type).toSet().length, equals(3));
      expect(contacts.map((c) => c.status).toSet().length, equals(3));
    });

    test('every contact references the same identity as the profile', () async {
      final identityId = (await repository.getProfile()).identityId;
      expect(
        (await repository.getContacts()).every(
          (c) => c.identityId == identityId,
        ),
        isTrue,
      );
    });

    test('is independent from every other feature mock data', () async {
      expect(
        (await repository.getContacts()).every(
          (c) => c.id.value.startsWith('contact-management-'),
        ),
        isTrue,
      );
    });
  });
}
