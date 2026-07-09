import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/chat/entities/chat.dart';
import 'package:mobile/chat/models/chat_id.dart';
import 'package:mobile/chat/models/chat_status.dart';
import 'package:mobile/chat/models/chat_type.dart';
import 'package:mobile/order/models/order_id.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/provider/models/provider_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = ChatId.create();
    final orderId = OrderId.create();
    final clientIdentityId = IdentityId.create();
    final providerId = ProviderId.create();
    final now = DateTime(2026, 1, 1);
    final chat = Chat(
      id: id,
      orderId: orderId,
      clientIdentityId: clientIdentityId,
      providerId: providerId,
      status: ChatStatus.active,
      type: ChatType.orderRelated,
      createdAt: now,
      updatedAt: now,
    );

    expect(chat.id, id);
    expect(chat.orderId, orderId);
    expect(chat.clientIdentityId, clientIdentityId);
    expect(chat.providerId, providerId);
    expect(chat.status, ChatStatus.active);
    expect(chat.type, ChatType.orderRelated);
  });

  test('is equal to another chat with the same id', () {
    final id = ChatId.create();
    final orderId = OrderId.create();
    final clientIdentityId = IdentityId.create();
    final providerId = ProviderId.create();
    final now = DateTime(2026, 1, 1);
    Chat build() => Chat(
      id: id,
      orderId: orderId,
      clientIdentityId: clientIdentityId,
      providerId: providerId,
      status: ChatStatus.active,
      type: ChatType.support,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
