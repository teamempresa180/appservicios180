import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class ServiceId extends ValueObject {
  const ServiceId._(this.value);

  factory ServiceId.create() => ServiceId._(generateId());

  factory ServiceId.fromString(String value) => ServiceId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
