import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class AddressId extends ValueObject {
  const AddressId._(this.value);

  factory AddressId.create() => AddressId._(generateId());

  factory AddressId.fromString(String value) => AddressId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
