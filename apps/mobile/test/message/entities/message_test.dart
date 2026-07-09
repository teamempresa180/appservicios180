import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/message/entities/message.dart';
import 'package:mobile/message/models/message_id.dart';
import 'package:mobile/message/models/message_type.dart';
import 'package:mobile/message/models/message_status.dart';
import 'package:mobile/chat/models/chat_id.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = MessageId.create();
    final chatId = ChatId.create();
    final senderIdentityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final message = Message(
      id: id,
      chatId: chatId,
      senderIdentityId: senderIdentityId,
      content: 'Hola, ¿a qué hora llegas?',
      type: MessageType.text,
      status: MessageStatus.sent,
      sentAt: now,
      readAt: null,
    );

    expect(message.id, id);
    expect(message.chatId, chatId);
    expect(message.senderIdentityId, senderIdentityId);
    expect(message.content, 'Hola, ¿a qué hora llegas?');
    expect(message.type, MessageType.text);
    expect(message.status, MessageStatus.sent);
    expect(message.readAt, isNull);
  });

  test('is equal to another message with the same id', () {
    final id = MessageId.create();
    final chatId = ChatId.create();
    final senderIdentityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    Message build() => Message(
      id: id,
      chatId: chatId,
      senderIdentityId: senderIdentityId,
      content: 'Mensaje',
      type: MessageType.text,
      status: MessageStatus.read,
      sentAt: now,
      readAt: now,
    );

    expect(build(), equals(build()));
  });
}
