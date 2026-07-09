/**
 * Intent to list Chats with pagination. Plain data — no behavior.
 */
export class ListChatQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
