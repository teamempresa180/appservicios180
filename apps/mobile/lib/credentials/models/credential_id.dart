import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class CredentialId extends ValueObject {
  const CredentialId._(this.value);

  factory CredentialId.create() => CredentialId._(generateId());

  factory CredentialId.fromString(String value) => CredentialId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
