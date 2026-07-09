import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class IdentityId extends ValueObject {
  const IdentityId._(this.value);

  factory IdentityId.create() => IdentityId._(generateId());

  factory IdentityId.fromString(String value) => IdentityId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
