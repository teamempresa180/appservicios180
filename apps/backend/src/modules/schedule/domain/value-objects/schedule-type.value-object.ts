/**
 * The kind of time block a schedule entry represents. A plain label — no
 * recurrence generation, no booking rules.
 */
export enum ScheduleType {
  Regular = 'REGULAR',
  Blocked = 'BLOCKED',
  Special = 'SPECIAL',
  Other = 'OTHER',
}
