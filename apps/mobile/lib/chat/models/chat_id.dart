import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class ChatId extends ValueObject {
  const ChatId._(this.value);

  factory ChatId.create() => ChatId._(generateId());

  factory ChatId.fromString(String value) => ChatId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
