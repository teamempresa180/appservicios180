import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/address/entities/address.dart';
import 'package:mobile/contact/entities/contact.dart';
import 'package:mobile/features/address_management/repositories/mock_address_management_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';

void main() {
  group('MockAddressManagementRepository', () {
    final repository = MockAddressManagementRepository();

    test('getAddresses returns real Address entities, not maps', () {
      final addresses = repository.getAddresses();
      expect(addresses, isNotEmpty);
      expect(addresses, everyElement(isA<Address>()));
    });

    test('returns exactly three addresses (Casa/Trabajo/Oficina)', () {
      final aliases = repository.getAddresses().map((a) => a.alias).toSet();
      expect(aliases, equals({'Casa', 'Trabajo', 'Oficina'}));
    });

    test('getProfile returns a real Profile with a display name', () {
      final profile = repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getContactFor returns a real Contact entity, not a map', () {
      final address = repository.getAddresses().first;
      expect(repository.getContactFor(address), isA<Contact>());
    });

    test('every address references the same identity as the profile', () {
      final identityId = repository.getProfile().identityId;
      expect(
        repository.getAddresses().every((a) => a.identityId == identityId),
        isTrue,
      );
    });

    test('is independent from every other feature mock data', () {
      expect(
        repository.getAddresses().every(
          (a) => a.id.value.startsWith('address-management-'),
        ),
        isTrue,
      );
    });
  });
}
