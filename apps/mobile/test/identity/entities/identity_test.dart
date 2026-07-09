import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/identity/entities/identity.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/identity/models/document_type.dart';
import 'package:mobile/identity/models/identity_status.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final identity = Identity(
      id: id,
      fullName: 'Ana María Gómez',
      documentType: DocumentType.nationalId,
      documentNumber: '1002003000',
      birthDate: DateTime(1990, 5, 10),
      status: IdentityStatus.active,
      createdAt: now,
      updatedAt: now,
    );

    expect(identity.id, id);
    expect(identity.fullName, 'Ana María Gómez');
    expect(identity.documentType, DocumentType.nationalId);
    expect(identity.status, IdentityStatus.active);
  });

  test('is equal to another identity with the same id', () {
    final id = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    Identity build() => Identity(
      id: id,
      fullName: 'Ana',
      documentType: DocumentType.nationalId,
      documentNumber: '123',
      birthDate: now,
      status: IdentityStatus.active,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
