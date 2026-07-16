import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/attachment/entities/attachment.dart';
import 'package:mobile/chat/entities/chat.dart';
import 'package:mobile/features/chat/repositories/mock_chat_repository.dart';
import 'package:mobile/message/entities/message.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';

void main() {
  group('MockChatRepository', () {
    final repository = MockChatRepository();

    test('getChat returns a real Chat entity, not a map', () async {
      expect(await repository.getChat(), isA<Chat>());
    });

    test('getProvider returns a real Provider entity, not a map', () async {
      expect(await repository.getProvider(), isA<Provider>());
    });

    test('getProfile returns a real Profile with a display name', () async {
      final profile = await repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getOrder returns a real Order entity, not a map', () async {
      expect(await repository.getOrder(), isA<Order>());
    });

    test('getMessages returns real Message entities, not maps', () async {
      final messages = await repository.getMessages();
      expect(messages, isNotEmpty);
      expect(messages, everyElement(isA<Message>()));
    });

    test('conversation alternates provider/client starting with provider', () async {
      final messages = await repository.getMessages();
      final provider = await repository.getProvider();
      expect(messages.length, equals(4));
      expect(messages[0].senderIdentityId, equals(provider.identityId));
      expect(messages[1].senderIdentityId, isNot(provider.identityId));
      expect(messages[2].senderIdentityId, equals(provider.identityId));
      expect(messages[3].senderIdentityId, isNot(provider.identityId));
    });

    test('every message belongs to the same chat returned', () async {
      final chatId = (await repository.getChat()).id;
      final messages = await repository.getMessages();
      expect(messages.every((m) => m.chatId == chatId), isTrue);
    });

    test('chat references the same order and provider returned', () async {
      final chat = await repository.getChat();
      final order = await repository.getOrder();
      final provider = await repository.getProvider();
      expect(chat.orderId, equals(order.id));
      expect(chat.providerId, equals(provider.id));
    });

    test('getAttachments returns real Attachment entities, not maps', () async {
      final attachments = await repository.getAttachments();
      expect(attachments, isNotEmpty);
      expect(attachments, everyElement(isA<Attachment>()));
    });

    test('returns five attachments covering every type and status', () async {
      final attachments = await repository.getAttachments();
      expect(attachments.length, equals(5));
      expect(attachments.map((a) => a.type).toSet().length, equals(5));
      expect(attachments.map((a) => a.status).toSet().length, equals(4));
    });

    test('every attachment references a real message id', () async {
      final messageIds = (await repository.getMessages())
          .map((m) => m.id)
          .toSet();
      final attachments = await repository.getAttachments();
      expect(
        attachments.every((a) => messageIds.contains(a.messageId)),
        isTrue,
      );
    });

    test('is independent from every other feature mock data', () async {
      final provider = await repository.getProvider();
      expect(provider.id.value.startsWith('chat-'), isTrue);
    });
  });
}
