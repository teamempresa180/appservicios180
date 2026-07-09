import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class ContactId extends ValueObject {
  const ContactId._(this.value);

  factory ContactId.create() => ContactId._(generateId());

  factory ContactId.fromString(String value) => ContactId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
