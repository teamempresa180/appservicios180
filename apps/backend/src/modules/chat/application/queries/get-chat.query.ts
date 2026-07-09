/**
 * Intent to fetch a single Chat by id. Plain data — no behavior.
 */
export class GetChatQuery {
  constructor(public readonly id: string) {}
}
