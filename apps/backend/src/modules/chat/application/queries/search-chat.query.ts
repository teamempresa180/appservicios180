/**
 * Intent to search Chats by a free-text term. Plain data — no behavior.
 */
export class SearchChatQuery {
  constructor(public readonly term: string) {}
}
