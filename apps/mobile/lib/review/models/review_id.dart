import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class ReviewId extends ValueObject {
  const ReviewId._(this.value);

  factory ReviewId.create() => ReviewId._(generateId());

  factory ReviewId.fromString(String value) => ReviewId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
