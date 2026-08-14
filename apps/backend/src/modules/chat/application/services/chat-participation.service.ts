import { Role } from '../../../../common/auth/role.enum';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatParticipantScope } from '../../domain/interfaces/chat-repository.interface';

/**
 * Single source of truth for "does this caller take part in this
 * conversation?". A Chat has exactly two sides and they are keyed
 * differently: the client by `Identity` id, the provider by `Provider`
 * id. `@CurrentUser()` only carries the Identity id, so the Provider
 * side has to be resolved through `ProviderRepository.findByIdentityId`
 * (same approach as `ListOrdersForProviderUseCase`) — a caller with no
 * Provider record simply has a `null` provider side.
 *
 * Exported by `ChatPresentationModule` so the Message module can reuse
 * it: a message is only readable/writable by a participant of its
 * Chat, and duplicating that rule there would let the two definitions
 * drift apart.
 */
export class ChatParticipationService {
  constructor(private readonly providerRepository: ProviderRepository) {}

  /**
   * Builds the caller's participant scope, or `null` for an Admin —
   * `null` means "no restriction" everywhere it is consumed.
   */
  async scopeFor(caller: AuthenticatedUser): Promise<ChatParticipantScope | null> {
    if (caller.role === Role.Admin) {
      return null;
    }
    const identityId = IdentityId.fromString(caller.id);
    const provider = await this.providerRepository.findByIdentityId(identityId);
    return {
      clientIdentityId: identityId,
      providerId: provider ? provider.id : null,
    };
  }

  static isParticipant(chat: Chat, scope: ChatParticipantScope | null): boolean {
    if (!scope) {
      return true;
    }
    return (
      chat.clientIdentityId.value === scope.clientIdentityId.value ||
      (scope.providerId !== null &&
        chat.providerId.value === scope.providerId.value)
    );
  }

  /** Throws `ForbiddenException` unless the caller is a participant or an Admin. */
  async assertParticipant(chat: Chat, caller: AuthenticatedUser): Promise<void> {
    const scope = await this.scopeFor(caller);
    if (!ChatParticipationService.isParticipant(chat, scope)) {
      throw new ForbiddenException(
        `Identity ${caller.id} is not a participant of Chat ${chat.id.value}`,
      );
    }
  }
}
