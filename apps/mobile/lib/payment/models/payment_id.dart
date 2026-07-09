import '../../core/base/value_object.dart';
import '../../core/utils/id_generator.dart';

class PaymentId extends ValueObject {
  const PaymentId._(this.value);

  factory PaymentId.create() => PaymentId._(generateId());

  factory PaymentId.fromString(String value) => PaymentId._(value);

  final String value;

  @override
  List<Object?> get props => [value];
}
