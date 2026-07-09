import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class MessageId extends ValueObject {
  const MessageId._(this.value);

  factory MessageId.create() => MessageId._(generateId());

  factory MessageId.fromString(String value) => MessageId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
