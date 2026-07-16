import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/address/entities/address.dart';
import 'package:mobile/contact/entities/contact.dart';
import 'package:mobile/features/address_management/repositories/mock_address_management_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';

void main() {
  group('MockAddressManagementRepository', () {
    final repository = MockAddressManagementRepository();

    test('getAddresses returns real Address entities, not maps', () async {
      final addresses = await repository.getAddresses();
      expect(addresses, isNotEmpty);
      expect(addresses, everyElement(isA<Address>()));
    });

    test('returns exactly three addresses (Casa/Trabajo/Oficina)', () async {
      final aliases = (await repository.getAddresses())
          .map((a) => a.alias)
          .toSet();
      expect(aliases, equals({'Casa', 'Trabajo', 'Oficina'}));
    });

    test('getProfile returns a real Profile with a display name', () async {
      final profile = await repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getContactFor returns a real Contact entity, not a map', () async {
      final address = (await repository.getAddresses()).first;
      expect(await repository.getContactFor(address), isA<Contact>());
    });

    test('every address references the same identity as the profile', () async {
      final identityId = (await repository.getProfile()).identityId;
      expect(
        (await repository.getAddresses()).every(
          (a) => a.identityId == identityId,
        ),
        isTrue,
      );
    });

    test('is independent from every other feature mock data', () async {
      expect(
        (await repository.getAddresses()).every(
          (a) => a.id.value.startsWith('address-management-'),
        ),
        isTrue,
      );
    });
  });
}
