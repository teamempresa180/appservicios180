import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class AuthenticationId extends ValueObject {
  const AuthenticationId._(this.value);

  factory AuthenticationId.create() => AuthenticationId._(generateId());

  factory AuthenticationId.fromString(String value) =>
      AuthenticationId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
