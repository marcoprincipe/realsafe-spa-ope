import { BankNoteDeposit } from 'src/app/model';

/**
 * Interface para armazenamento dos dados de retorno
 * de uma transação de depósito.
 */

export interface DepositResponse {
	terminalId: string;
	nsuTerminal: string;
	dateTime: Date;
	bankNotes: Array<BankNoteDeposit>; 
	amount: number;
}