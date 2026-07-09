/**
 * The kind of service being offered. A plain label — no scheduling, no
 * availability, no pricing logic.
 */
export enum ServiceType {
  Standard = 'STANDARD',
  Express = 'EXPRESS',
  Custom = 'CUSTOM',
  Other = 'OTHER',
}
