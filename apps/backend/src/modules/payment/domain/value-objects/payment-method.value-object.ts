/**
 * The general channel used for a payment. A plain label — no gateway
 * integration, no transaction handling.
 */
export enum PaymentMethod {
  Card = 'CARD',
  BankTransfer = 'BANK_TRANSFER',
  Cash = 'CASH',
  DigitalWallet = 'DIGITAL_WALLET',
  Other = 'OTHER',
}
