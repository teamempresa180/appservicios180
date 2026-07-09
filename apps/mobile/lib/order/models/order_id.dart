import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class OrderId extends ValueObject {
  const OrderId._(this.value);

  factory OrderId.create() => OrderId._(generateId());

  factory OrderId.fromString(String value) => OrderId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
