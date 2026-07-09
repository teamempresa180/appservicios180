/**
 * Intent to fetch a single Contact by id. Plain data — no behavior.
 */
export class GetContactQuery {
  constructor(public readonly id: string) {}
}
