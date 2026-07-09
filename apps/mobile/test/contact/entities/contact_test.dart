import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/contact/entities/contact.dart';
import 'package:mobile/contact/models/contact_id.dart';
import 'package:mobile/contact/models/contact_type.dart';
import 'package:mobile/contact/models/contact_status.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = ContactId.create();
    final identityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final contact = Contact(
      id: id,
      identityId: identityId,
      type: ContactType.email,
      value: 'ana@example.com',
      status: ContactStatus.active,
      createdAt: now,
      updatedAt: now,
    );

    expect(contact.id, id);
    expect(contact.identityId, identityId);
    expect(contact.type, ContactType.email);
    expect(contact.value, 'ana@example.com');
  });
}
