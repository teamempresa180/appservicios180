import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class ProviderId extends ValueObject {
  const ProviderId._(this.value);

  factory ProviderId.create() => ProviderId._(generateId());

  factory ProviderId.fromString(String value) => ProviderId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
