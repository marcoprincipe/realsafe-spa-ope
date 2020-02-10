/**
 * Interface para armazenamento dos dados do
 * resultado da contagem de cédulas do depositário.
 */

export interface DepositoryCountResponse {
    status: number;
    amount: number;
    bankNotes: any;
}