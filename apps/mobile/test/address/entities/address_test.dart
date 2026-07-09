import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/address/entities/address.dart';
import 'package:mobile/address/models/address_id.dart';
import 'package:mobile/address/models/address_type.dart';
import 'package:mobile/address/models/address_status.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = AddressId.create();
    final identityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final address = Address(
      id: id,
      identityId: identityId,
      alias: 'Casa',
      fullAddress: 'Calle 123 #45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      type: AddressType.home,
      status: AddressStatus.active,
      createdAt: now,
      updatedAt: now,
    );

    expect(address.id, id);
    expect(address.identityId, identityId);
    expect(address.alias, 'Casa');
    expect(address.type, AddressType.home);
    expect(address.status, AddressStatus.active);
  });

  test('is equal to another address with the same id', () {
    final id = AddressId.create();
    final identityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    Address build() => Address(
      id: id,
      identityId: identityId,
      alias: 'Casa',
      fullAddress: 'Calle 123',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      type: AddressType.home,
      status: AddressStatus.active,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
