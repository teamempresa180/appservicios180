import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class ScheduleId extends ValueObject {
  const ScheduleId._(this.value);

  factory ScheduleId.create() => ScheduleId._(generateId());

  factory ScheduleId.fromString(String value) => ScheduleId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
