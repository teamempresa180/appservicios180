/**
 * The general kind of availability a provider declares. A plain label —
 * no schedule, no calendar, no booking rules.
 */
export enum AvailabilityType {
  FullTime = 'FULL_TIME',
  PartTime = 'PART_TIME',
  OnDemand = 'ON_DEMAND',
  Seasonal = 'SEASONAL',
  Other = 'OTHER',
}
