import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class VerificationId extends ValueObject {
  const VerificationId._(this.value);

  factory VerificationId.create() => VerificationId._(generateId());

  factory VerificationId.fromString(String value) => VerificationId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
