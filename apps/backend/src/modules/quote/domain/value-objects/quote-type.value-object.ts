/**
 * The kind of quote a provider submits. A plain label — no negotiation,
 * no approval logic.
 */
export enum QuoteType {
  Standard = 'STANDARD',
  Detailed = 'DETAILED',
  Estimate = 'ESTIMATE',
  Other = 'OTHER',
}
