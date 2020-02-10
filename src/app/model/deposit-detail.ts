/**
 * Interface para armazenamento dos dados de linha do detalhe de depósito.
 */

export interface DepositDetail {
    groupOwnerId: number;
    terminalId: string;
    unitId: number;
    userId: number;
    dateTime: Date;
    includeOrder: number;
    quantity: number;
    amount: number;
}