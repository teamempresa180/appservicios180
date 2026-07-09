import '../../core/base/entity.dart';
import '../models/identity_id.dart';
import '../models/document_type.dart';
import '../models/identity_status.dart';

/// Represents the core legal identity of a person.
/// Pure data holder — no behavior, no persistence, no business rules.
class Identity extends Entity<IdentityId> {
  const Identity({
    required IdentityId id,
    required this.fullName,
    required this.documentType,
    required this.documentNumber,
    required this.birthDate,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final String fullName;
  final DocumentType documentType;
  final String documentNumber;
  final DateTime birthDate;
  final IdentityStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
}
