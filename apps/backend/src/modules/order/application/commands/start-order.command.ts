/**
 * Intent to mark an accepted Order as in progress. Plain data — no
 * behavior.
 */
export class StartOrderCommand {
  constructor(public readonly id: string) {}
}
