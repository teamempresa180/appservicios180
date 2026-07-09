import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class AttachmentId extends ValueObject {
  const AttachmentId._(this.value);

  factory AttachmentId.create() => AttachmentId._(generateId());

  factory AttachmentId.fromString(String value) => AttachmentId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
