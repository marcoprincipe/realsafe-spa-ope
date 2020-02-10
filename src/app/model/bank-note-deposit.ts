/**
 * Interface para armazenamento dos dados de linha da confirmação de um depósito.
 */

export interface BankNoteDeposit {
    quantity: number;
    value: number;
    amount?: number,
    total?: number;
}