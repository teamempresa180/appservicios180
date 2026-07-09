import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class AuditId extends ValueObject {
  const AuditId._(this.value);

  factory AuditId.create() => AuditId._(generateId());

  factory AuditId.fromString(String value) => AuditId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
