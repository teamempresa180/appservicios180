import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class ProfileId extends ValueObject {
  const ProfileId._(this.value);

  factory ProfileId.create() => ProfileId._(generateId());

  factory ProfileId.fromString(String value) => ProfileId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
