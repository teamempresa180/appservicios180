import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class CategoryId extends ValueObject {
  const CategoryId._(this.value);

  factory CategoryId.create() => CategoryId._(generateId());

  factory CategoryId.fromString(String value) => CategoryId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
