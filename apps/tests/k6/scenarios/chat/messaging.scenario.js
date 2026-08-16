/**
 * Chat: create a Chat on a fresh Order, send a message as the client,
 * read the conversation back — the concurrency-sensitive path
 * (`SendMessageUseCase` verifies the sender is a real participant of
 * the Chat on every call, Etapa 18) that's most likely to show lock
 * contention under load since every message write also reads the
 * parent Chat row.
 */
import { getFixtures } from '../../data/fixtures.js';
import { TEST_DATA_TAG } from '../../config/environment.js';
import { createTestOrder } from '../orders/lifecycle.scenario.js';
import { loginAs } from '../../helpers/auth.js';
import { apiGet, apiPost } from '../../helpers/http.js';
import { checkStatus, safeJson } from '../../helpers/checks.js';
import { domainMetrics, recordOutcome } from '../../helpers/metrics.js';

export const chatCreateMetrics = domainMetrics('chat_create');
export const messageSendMetrics = domainMetrics('message_send');
export const messageListMetrics = domainMetrics('message_list');

export function createChatSendAndReadMessages() {
  const created = createTestOrder();
  if (!created) return;
  const { order, session: clientSession, client } = created;

  const provider = getFixtures().providers[Math.floor(Math.random() * getFixtures().providers.length)];

  const chatRes = apiPost(
    'chats',
    {
      orderId: order.id,
      clientIdentityId: client.identityId,
      providerId: provider.providerId,
      type: 'ORDER_RELATED',
    },
    clientSession.accessToken,
    { tags: { name: 'chat_create' } },
  );
  recordOutcome(chatCreateMetrics, chatRes, [201]);
  checkStatus(chatRes, 201, 'chat_create');
  const chat = safeJson(chatRes);
  if (!chat || !chat.id) return;

  const messageRes = apiPost(
    'messages',
    {
      chatId: chat.id,
      senderIdentityId: client.identityId,
      content: `${TEST_DATA_TAG} message — k6 load test.`,
      type: 'TEXT',
    },
    clientSession.accessToken,
    { tags: { name: 'message_send' } },
  );
  recordOutcome(messageSendMetrics, messageRes, [201]);
  checkStatus(messageRes, 201, 'message_send');

  const listRes = apiGet('messages?page=1&pageSize=20', clientSession.accessToken, {
    tags: { name: 'message_list' },
  });
  recordOutcome(messageListMetrics, listRes, [200]);
  checkStatus(listRes, 200, 'message_list');
}
