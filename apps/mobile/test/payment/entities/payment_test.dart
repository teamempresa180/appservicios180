import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/payment/entities/payment.dart';
import 'package:mobile/payment/models/payment_id.dart';
import 'package:mobile/payment/models/payment_status.dart';
import 'package:mobile/payment/models/payment_method.dart';
import 'package:mobile/quote/models/quote_id.dart';
import 'package:mobile/order/models/order_id.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/provider/models/provider_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = PaymentId.create();
    final quoteId = QuoteId.create();
    final orderId = OrderId.create();
    final payerIdentityId = IdentityId.create();
    final receiverProviderId = ProviderId.create();
    final now = DateTime(2026, 1, 1);
    final payment = Payment(
      id: id,
      quoteId: quoteId,
      orderId: orderId,
      payerIdentityId: payerIdentityId,
      receiverProviderId: receiverProviderId,
      amount: 45000,
      method: PaymentMethod.card,
      status: PaymentStatus.completed,
      createdAt: now,
      updatedAt: now,
    );

    expect(payment.id, id);
    expect(payment.quoteId, quoteId);
    expect(payment.orderId, orderId);
    expect(payment.payerIdentityId, payerIdentityId);
    expect(payment.receiverProviderId, receiverProviderId);
    expect(payment.amount, 45000);
    expect(payment.method, PaymentMethod.card);
    expect(payment.status, PaymentStatus.completed);
  });

  test('is equal to another payment with the same id', () {
    final id = PaymentId.create();
    final quoteId = QuoteId.create();
    final orderId = OrderId.create();
    final payerIdentityId = IdentityId.create();
    final receiverProviderId = ProviderId.create();
    final now = DateTime(2026, 1, 1);
    Payment build() => Payment(
      id: id,
      quoteId: quoteId,
      orderId: orderId,
      payerIdentityId: payerIdentityId,
      receiverProviderId: receiverProviderId,
      amount: 1000,
      method: PaymentMethod.cash,
      status: PaymentStatus.pending,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
