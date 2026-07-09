import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class AvailabilityId extends ValueObject {
  const AvailabilityId._(this.value);

  factory AvailabilityId.create() => AvailabilityId._(generateId());

  factory AvailabilityId.fromString(String value) => AvailabilityId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
