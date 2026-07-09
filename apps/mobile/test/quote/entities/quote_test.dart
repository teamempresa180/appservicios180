import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/quote/models/quote_id.dart';
import 'package:mobile/quote/models/quote_status.dart';
import 'package:mobile/quote/models/quote_type.dart';
import 'package:mobile/order/models/order_id.dart';
import 'package:mobile/provider/models/provider_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = QuoteId.create();
    final orderId = OrderId.create();
    final providerId = ProviderId.create();
    final now = DateTime(2026, 1, 1);
    final quote = Quote(
      id: id,
      orderId: orderId,
      providerId: providerId,
      proposedPrice: 45000,
      estimatedDuration: 90,
      notes: 'Incluye mano de obra, no incluye materiales',
      status: QuoteStatus.pending,
      type: QuoteType.detailed,
      createdAt: now,
      updatedAt: now,
    );

    expect(quote.id, id);
    expect(quote.orderId, orderId);
    expect(quote.providerId, providerId);
    expect(quote.proposedPrice, 45000);
    expect(quote.estimatedDuration, 90);
    expect(quote.status, QuoteStatus.pending);
    expect(quote.type, QuoteType.detailed);
  });

  test('is equal to another quote with the same id', () {
    final id = QuoteId.create();
    final orderId = OrderId.create();
    final providerId = ProviderId.create();
    final now = DateTime(2026, 1, 1);
    Quote build() => Quote(
      id: id,
      orderId: orderId,
      providerId: providerId,
      proposedPrice: 1000,
      estimatedDuration: 30,
      notes: 'Notas',
      status: QuoteStatus.pending,
      type: QuoteType.standard,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
