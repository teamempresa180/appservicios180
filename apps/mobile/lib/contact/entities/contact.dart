import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../models/contact_id.dart';
import '../models/contact_type.dart';
import '../models/contact_status.dart';

/// Represents a contact channel (email, phone) associated with an Identity.
/// Pure data holder — no format validation, no verification logic, no
/// persistence, no business rules.
class Contact extends Entity<ContactId> {
  const Contact({
    required ContactId id,
    required this.identityId,
    required this.type,
    required this.value,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final IdentityId identityId;
  final ContactType type;
  final String value;
  final ContactStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;

  Contact copyWith({String? value}) {
    return Contact(
      id: id,
      identityId: identityId,
      type: type,
      value: value ?? this.value,
      status: status,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
