/**
 * Intent to fetch a single Message by id. Plain data — no behavior.
 */
export class GetMessageQuery {
  constructor(public readonly id: string) {}
}
