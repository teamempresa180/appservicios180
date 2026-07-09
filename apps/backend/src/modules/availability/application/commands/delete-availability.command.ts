/**
 * Intent to delete an existing Availability. Plain data — no behavior.
 */
export class DeleteAvailabilityCommand {
  constructor(public readonly id: string) {}
}
