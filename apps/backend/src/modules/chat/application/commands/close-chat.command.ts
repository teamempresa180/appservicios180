/**
 * Intent to close an existing Chat. Plain data — no behavior.
 */
export class CloseChatCommand {
  constructor(public readonly id: string) {}
}
