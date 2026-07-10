import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/chat/entities/chat.dart';
import 'package:mobile/features/chat/repositories/mock_chat_repository.dart';
import 'package:mobile/message/entities/message.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';

void main() {
  group('MockChatRepository', () {
    final repository = MockChatRepository();

    test('getChat returns a real Chat entity, not a map', () {
      expect(repository.getChat(), isA<Chat>());
    });

    test('getProvider returns a real Provider entity, not a map', () {
      expect(repository.getProvider(), isA<Provider>());
    });

    test('getProfile returns a real Profile with a display name', () {
      final profile = repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getOrder returns a real Order entity, not a map', () {
      expect(repository.getOrder(), isA<Order>());
    });

    test('getMessages returns real Message entities, not maps', () {
      final messages = repository.getMessages();
      expect(messages, isNotEmpty);
      expect(messages, everyElement(isA<Message>()));
    });

    test('conversation alternates provider/client starting with provider', () {
      final messages = repository.getMessages();
      final provider = repository.getProvider();
      expect(messages.length, equals(4));
      expect(messages[0].senderIdentityId, equals(provider.identityId));
      expect(messages[1].senderIdentityId, isNot(provider.identityId));
      expect(messages[2].senderIdentityId, equals(provider.identityId));
      expect(messages[3].senderIdentityId, isNot(provider.identityId));
    });

    test('every message belongs to the same chat returned', () {
      final chatId = repository.getChat().id;
      expect(repository.getMessages().every((m) => m.chatId == chatId), isTrue);
    });

    test('chat references the same order and provider returned', () {
      final chat = repository.getChat();
      expect(chat.orderId, equals(repository.getOrder().id));
      expect(chat.providerId, equals(repository.getProvider().id));
    });

    test('is independent from every other feature mock data', () {
      expect(repository.getProvider().id.value.startsWith('chat-'), isTrue);
    });
  });
}
