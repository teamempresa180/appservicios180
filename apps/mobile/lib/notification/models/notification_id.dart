import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class NotificationId extends ValueObject {
  const NotificationId._(this.value);

  factory NotificationId.create() => NotificationId._(generateId());

  factory NotificationId.fromString(String value) => NotificationId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
