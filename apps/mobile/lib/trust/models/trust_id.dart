import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class TrustId extends ValueObject {
  const TrustId._(this.value);

  factory TrustId.create() => TrustId._(generateId());

  factory TrustId.fromString(String value) => TrustId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
